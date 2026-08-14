package com.autoforge.modules.future.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class InsuranceClaimsService {

    private final Map<UUID, InsuranceClaim> claimsRegistry = new HashMap<>();

    public InsuranceClaim initiateClaim(UUID roId, double coveragePercentage, String inspectorName) {
        InsuranceClaim claim = new InsuranceClaim();
        claim.setId(UUID.randomUUID());
        claim.setRepairOrderId(roId);
        claim.setCoveragePercentage(coveragePercentage);
        claim.setInspectorName(inspectorName);
        claim.setStatus("INSPECTION_PENDING");
        claim.setInspectorSignature("");
        claim.setInsuranceCompany("Bảo hiểm PVI (PVI Insurance)");
        claim.setTotalAmount(1500000.0); // Demo amount
        calculateSplits(claim);

        claimsRegistry.put(roId, claim);
        return claim;
    }

    public InsuranceClaim approveClaim(UUID roId, String signature) {
        InsuranceClaim claim = claimsRegistry.get(roId);
        if (claim == null) {
            throw new IllegalArgumentException("Claim not found for this repair order");
        }
        claim.setInspectorSignature(signature);
        claim.setStatus("APPROVED_BY_ASSESSOR");
        return claim;
    }

    public InsuranceClaim getClaimByRoId(UUID roId) {
        return claimsRegistry.get(roId);
    }

    private void calculateSplits(InsuranceClaim claim) {
        double insurance = (claim.getTotalAmount() * claim.getCoveragePercentage()) / 100.0;
        double customer = claim.getTotalAmount() - insurance;
        claim.setInsurancePayable(insurance);
        claim.setCustomerPayable(customer);
    }

    @Getter
    @Setter
    public static class InsuranceClaim {
        private UUID id;
        private UUID repairOrderId;
        private String insuranceCompany;
        private double coveragePercentage;
        private double totalAmount;
        private double insurancePayable;
        private double customerPayable;
        private String inspectorName;
        private String inspectorSignature;
        private String status; // INSPECTION_PENDING, APPROVED_BY_ASSESSOR, CLOSED
    }
}
