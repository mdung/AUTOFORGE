package com.autoforge.modules.future.controller;

import com.autoforge.modules.future.service.EInvoiceService;
import com.autoforge.modules.future.service.InsuranceClaimsService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final EInvoiceService eInvoiceService;
    private final InsuranceClaimsService insuranceClaimsService;

    @PostMapping("/einvoices/issue")
    public ResponseEntity<EInvoiceService.EInvoiceRecord> issueEInvoice(@RequestBody EInvoicePayload payload) {
        return ResponseEntity.ok(eInvoiceService.issueVATInvoice(payload.getInvoiceId(), payload.getProvider()));
    }

    @GetMapping("/einvoices/invoice/{invoiceId}")
    public ResponseEntity<EInvoiceService.EInvoiceRecord> getEInvoice(@PathVariable UUID invoiceId) {
        EInvoiceService.EInvoiceRecord record = eInvoiceService.getEInvoiceByInvoiceId(invoiceId);
        if (record != null) {
            return ResponseEntity.ok(record);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/claims/initiate")
    public ResponseEntity<InsuranceClaimsService.InsuranceClaim> initiateClaim(@RequestBody InitiateClaimPayload payload) {
        return ResponseEntity.ok(insuranceClaimsService.initiateClaim(
            payload.getRepairOrderId(),
            payload.getCoveragePercentage(),
            payload.getInspectorName()
        ));
    }

    @PostMapping("/claims/approve")
    public ResponseEntity<InsuranceClaimsService.InsuranceClaim> approveClaim(@RequestBody ApproveClaimPayload payload) {
        return ResponseEntity.ok(insuranceClaimsService.approveClaim(
            payload.getRepairOrderId(),
            payload.getSignature()
        ));
    }

    @GetMapping("/claims/ro/{roId}")
    public ResponseEntity<InsuranceClaimsService.InsuranceClaim> getClaimByRo(@PathVariable UUID roId) {
        InsuranceClaimsService.InsuranceClaim claim = insuranceClaimsService.getClaimByRoId(roId);
        if (claim != null) {
            return ResponseEntity.ok(claim);
        }
        return ResponseEntity.notFound().build();
    }

    @Getter
    @Setter
    public static class EInvoicePayload {
        private UUID invoiceId;
        private String provider; // VIETTEL, VNPT, MISA
    }

    @Getter
    @Setter
    public static class InitiateClaimPayload {
        private UUID repairOrderId;
        private double coveragePercentage;
        private String inspectorName;
    }

    @Getter
    @Setter
    public static class ApproveClaimPayload {
        private UUID repairOrderId;
        private String signature;
    }
}
