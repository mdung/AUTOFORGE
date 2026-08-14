package com.autoforge.modules.invoice.controller;

import com.autoforge.modules.invoice.model.Invoice;
import com.autoforge.modules.invoice.model.Payment;
import com.autoforge.modules.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final com.autoforge.modules.invoice.service.VNPayPaymentProvider vnPayPaymentProvider;
    private final com.autoforge.modules.invoice.service.StripePaymentProvider stripePaymentProvider;

    @PostMapping("/{id}/payment-link")
    public ResponseEntity<Map<String, String>> getPaymentLink(
            @PathVariable UUID id, 
            @RequestParam String provider,
            jakarta.servlet.http.HttpServletRequest request) {
        
        Invoice invoice = invoiceService.getInvoiceById(id);
        String clientIp = request.getRemoteAddr();
        String url;

        if ("VNPAY".equalsIgnoreCase(provider)) {
            url = vnPayPaymentProvider.createPaymentUrl(invoice, clientIp);
        } else {
            url = stripePaymentProvider.createPaymentUrl(invoice, clientIp);
        }

        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", url);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @PostMapping("/repairorders/{roId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_CASHIER', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<Invoice> generateInvoiceForRO(@PathVariable UUID roId) {
        return ResponseEntity.ok(invoiceService.generateInvoiceForRO(roId));
    }

    @PostMapping("/{id}/payments")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<Payment> recordPayment(@PathVariable UUID id, @jakarta.validation.Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(invoiceService.recordPayment(id, payment));
    }
}
