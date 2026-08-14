package com.autoforge.modules.invoice.controller;

import com.autoforge.modules.invoice.model.Payment;
import com.autoforge.modules.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/public/payments")
@RequiredArgsConstructor
@Slf4j
public class PublicPaymentController {

    private final InvoiceService invoiceService;

    @GetMapping("/vnpay-callback")
    public RedirectView vnpayCallback(@RequestParam Map<String, String> params) {
        log.info("Received VNPay Callback: {}", params);
        
        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef"); // This is our Invoice UUID
        
        if ("00".equals(responseCode) && txnRef != null) {
            try {
                UUID invoiceId = UUID.fromString(txnRef);
                
                // VNPay amount is multiplied by 100, so we divide back
                double amount = Double.parseDouble(params.get("vnp_Amount")) / 100.0;
                
                Payment payment = new Payment();
                payment.setAmount(amount);
                payment.setPaymentMethod("BANK_TRANSFER");
                payment.setReferenceNumber(params.get("vnp_TransactionNo"));
                
                // Fetch the invoice. Note that since this is an anonymous callback, we bypass 
                // security context and set the tenant context to the invoice's tenant to write to DB
                // This is a standard webhook handler design.
                com.autoforge.modules.invoice.model.Invoice invoice = invoiceService.getInvoiceById(invoiceId);
                com.autoforge.core.tenant.TenantContext.setCurrentTenant(invoice.getTenantId());
                
                invoiceService.recordPayment(invoiceId, payment);
                
                com.autoforge.core.tenant.TenantContext.clear();
                
                return new RedirectView("http://localhost:5173/?payment=success");
            } catch (Exception e) {
                log.error("Failed to process VNPay callback parameters: {}", e.getMessage());
            }
        }
        
        return new RedirectView("http://localhost:5173/?payment=failed");
    }
}
