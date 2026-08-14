package com.autoforge.modules.parts.service;

import com.autoforge.modules.parts.model.Part;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MarketplaceSupplierClient implements SupplierClient {

    @Override
    public List<Part> searchMarketplaceParts(String query) {
        List<Part> results = new ArrayList<>();
        if (query == null || query.isBlank()) {
            return results;
        }

        String q = query.toLowerCase();

        // Simulate remote warehouse database lookup
        if (q.contains("brake") || q.contains("pad")) {
            Part p = new Part();
            p.setId(UUID.randomUUID());
            p.setSku("BOS-BRK-F-889");
            p.setOemNumber("04465-33470");
            p.setName("Bosch Premium Front Brake Pads");
            p.setBrand("Bosch");
            p.setCategory("Brakes");
            p.setCost(320000.0);
            p.setSellingPrice(480000.0);
            p.setStockQty(15); // Available at supplier
            p.setLocation("Warehouse A (2 hrs ETA)");
            results.add(p);
        }

        if (q.contains("oil") || q.contains("lubricant")) {
            Part p = new Part();
            p.setId(UUID.randomUUID());
            p.setSku("MOB-1-5W30");
            p.setName("Mobil 1 Advanced Full Synthetic 5W-30");
            p.setBrand("Mobil 1");
            p.setCategory("Fluids");
            p.setCost(180000.0);
            p.setSellingPrice(280000.0);
            p.setStockQty(100);
            p.setLocation("Warehouse B (1 day ETA)");
            results.add(p);
        }

        if (q.contains("spark") || q.contains("plug")) {
            Part p = new Part();
            p.setId(UUID.randomUUID());
            p.setSku("NGK-SPK-902");
            p.setOemNumber("90919-01247");
            p.setName("NGK Iridium Spark Plug");
            p.setBrand("NGK");
            p.setCategory("Electrical");
            p.setCost(90000.0);
            p.setSellingPrice(150000.0);
            p.setStockQty(40);
            p.setLocation("Warehouse A (2 hrs ETA)");
            results.add(p);
        }

        return results;
    }
}
