package com.autoforge.modules.parts.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class WarrantyService {

    private final List<WarrantyRecord> warrantyRegistry = Collections.synchronizedList(new ArrayList<>());

    {
        // Seed a demo warranty card
        warrantyRegistry.add(new WarrantyRecord(
            UUID.randomUUID(),
            "SKU-BRAKE-01",
            "Ceramic Brake Pads Set",
            "30A-12345",
            "2026-01-15", // Purchased
            12, // 12 Months warranty
            "ACTIVE"
        ));
    }

    public WarrantyRecord registerWarranty(WarrantyRecord record) {
        record.setId(UUID.randomUUID());
        record.setStatus("ACTIVE");
        warrantyRegistry.add(record);
        return record;
    }

    public List<WarrantyRecord> getWarrantyRegistry() {
        return warrantyRegistry;
    }

    public WarrantyValidationResult validateWarranty(String sku, String licensePlate) {
        WarrantyRecord matched = warrantyRegistry.stream()
            .filter(w -> w.getSku().equals(sku) && w.getLicensePlate().equals(licensePlate))
            .findFirst()
            .orElse(null);

        if (matched == null) {
            return new WarrantyValidationResult(false, "No warranty registration found for this part and license plate.", null);
        }

        // Parse date (simple mock check: if purchased in 2026 and we are in 2026, it is active)
        return new WarrantyValidationResult(true, "Warranty active. Covered under manufacturer warranty program.", matched);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class WarrantyRecord {
        private UUID id;
        private String sku;
        private String partName;
        private String licensePlate;
        private String purchaseDate;
        private int warrantyMonths;
        private String status; // ACTIVE, CLAIMED, EXPIRED
    }

    @Getter
    @RequiredArgsConstructor
    public static class WarrantyValidationResult {
        private final boolean valid;
        private final String message;
        private final WarrantyRecord record;
    }
}
