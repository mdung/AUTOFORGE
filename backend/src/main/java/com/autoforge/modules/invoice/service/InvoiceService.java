package com.autoforge.modules.invoice.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.invoice.model.Invoice;
import com.autoforge.modules.invoice.model.Payment;
import com.autoforge.modules.invoice.repository.InvoiceRepository;
import com.autoforge.modules.invoice.repository.PaymentRepository;
import com.autoforge.modules.repairorder.model.RepairOrder;
import com.autoforge.modules.repairorder.service.RepairOrderService;
import com.autoforge.modules.estimate.model.Estimate;
import com.autoforge.modules.estimate.model.EstimateItem;
import com.autoforge.modules.estimate.repository.EstimateRepository;
import com.autoforge.modules.estimate.repository.EstimateItemRepository;
import com.autoforge.modules.audit.event.DomainEvent;
import com.autoforge.modules.audit.event.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final RepairOrderService repairOrderService;
    private final EstimateRepository estimateRepository;
    private final EstimateItemRepository estimateItemRepository;
    private final DomainEventPublisher domainEventPublisher;

    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public Invoice getInvoiceById(UUID id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (!invoice.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied");
        }
        return invoice;
    }

    @Transactional
    public Invoice generateInvoiceForRO(UUID roId) {
        UUID tenantId = TenantContext.getCurrentTenant();
        RepairOrder ro = repairOrderService.getRepairOrderById(roId);

        // Check if invoice already exists
        Optional<Invoice> existing = invoiceRepository.findByTenantIdAndRepairOrderId(tenantId, roId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Pull approved items from estimate
        Optional<Estimate> estimateOpt = estimateRepository.findByTenantIdAndRepairOrderId(tenantId, roId);
        double subtotal = 0.0;
        double tax = 0.0;
        double discount = 0.0;
        
        if (estimateOpt.isPresent()) {
            List<EstimateItem> items = estimateItemRepository.findAllByTenantIdAndEstimateId(tenantId, estimateOpt.get().getId());
            for (EstimateItem item : items) {
                if ("APPROVED".equalsIgnoreCase(item.getStatus())) {
                    subtotal += item.getUnitPrice() * item.getQuantity();
                }
            }
            tax = subtotal * estimateOpt.get().getTaxRate();
            discount = estimateOpt.get().getDiscountAmount();
        }

        Invoice invoice = new Invoice();
        invoice.setTenantId(tenantId);
        invoice.setRepairOrderId(roId);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
        invoice.setSubtotal(subtotal);
        invoice.setTax(tax);
        invoice.setDiscount(discount);
        invoice.setTotal(subtotal + tax - discount);
        invoice.setStatus("ISSUED");

        Invoice saved = invoiceRepository.save(invoice);
        
        try {
            domainEventPublisher.publish(new DomainEvent(
                tenantId,
                getCurrentActor(),
                "INVOICE_ISSUED",
                "Invoice",
                saved.getId(),
                null,
                Map.of("invoiceNumber", saved.getInvoiceNumber(), "total", saved.getTotal())
            ));
        } catch (Exception e) { /* ignore */ }

        return saved;
    }

    @Transactional
    public Payment recordPayment(UUID invoiceId, Payment payment) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Invoice invoice = getInvoiceById(invoiceId);

        payment.setTenantId(tenantId);
        payment.setInvoiceId(invoiceId);
        Payment savedPayment = paymentRepository.save(payment);

        // Recalculate and update invoice status
        List<Payment> payments = paymentRepository.findAllByTenantIdAndInvoiceId(tenantId, invoiceId);
        double totalPaid = 0.0;
        for (Payment p : payments) {
            totalPaid += p.getAmount();
        }

        if (totalPaid >= invoice.getTotal()) {
            invoice.setStatus("PAID");
            // Automatically mark Repair Order as READY_FOR_DELIVERY / DELIVERED
            repairOrderService.updateStatus(invoice.getRepairOrderId(), "DELIVERED");
        } else if (totalPaid > 0) {
            invoice.setStatus("PARTIALLY_PAID");
        }
        invoiceRepository.save(invoice);

        try {
            domainEventPublisher.publish(new DomainEvent(
                tenantId,
                getCurrentActor(),
                "PAYMENT_RECEIVED",
                "Payment",
                savedPayment.getId(),
                null,
                Map.of("invoiceId", invoiceId.toString(), "amount", savedPayment.getAmount(), "method", savedPayment.getPaymentMethod())
            ));
        } catch (Exception e) { /* ignore */ }

        return savedPayment;
    }

    private String getCurrentActor() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "system";
    }
}
