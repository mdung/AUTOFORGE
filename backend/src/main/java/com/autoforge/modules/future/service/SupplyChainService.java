package com.autoforge.modules.future.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SupplyChainService {

    private final List<PurchaseOrder> purchaseOrders = Collections.synchronizedList(new ArrayList<>());
    private final List<BranchStock> branchStocks = Collections.synchronizedList(new ArrayList<>());

    {
        // Setup initial mock stock levels across different branches for common items
        branchStocks.add(new BranchStock("Branch A (Cầu Giấy)", "SKU-BRAKE-01", 1, 3, 10)); // Low stock! Reorder Point = 3
        branchStocks.add(new BranchStock("Branch B (Đống Đa)", "SKU-BRAKE-01", 8, 3, 10));  // Excess stock!
        
        branchStocks.add(new BranchStock("Branch A (Cầu Giấy)", "SKU-OIL-10W40", 2, 5, 20)); // Low stock! Reorder Point = 5
        branchStocks.add(new BranchStock("Branch B (Đống Đa)", "SKU-OIL-10W40", 15, 5, 20)); // Excess stock!
    }

    public List<PurchaseOrder> getPurchaseOrders() {
        return purchaseOrders;
    }

    public List<BranchStock> getBranchStocks() {
        return branchStocks;
    }

    public List<PurchaseOrder> triggerAutoReplenishment() {
        List<PurchaseOrder> newOrders = new ArrayList<>();
        Map<String, List<PurchaseOrderItem>> groupedBySupplier = new HashMap<>();

        for (BranchStock stock : branchStocks) {
            if (stock.getStock() <= stock.getReorderPoint()) {
                int quantityToOrder = stock.getMaxCapacity() - stock.getStock();
                String supplier = getSupplierBySku(stock.getSku());

                PurchaseOrderItem item = new PurchaseOrderItem(
                    stock.getSku(),
                    getPartNameBySku(stock.getSku()),
                    quantityToOrder,
                    stock.getBranchName()
                );

                groupedBySupplier.computeIfAbsent(supplier, k -> new ArrayList<>()).add(item);
            }
        }

        for (Map.Entry<String, List<PurchaseOrderItem>> entry : groupedBySupplier.entrySet()) {
            PurchaseOrder po = new PurchaseOrder();
            po.setId(UUID.randomUUID());
            po.setPoNumber("PO-" + (1000 + purchaseOrders.size() + 1));
            po.setSupplierName(entry.getKey());
            po.setItems(entry.getValue());
            po.setStatus("SENT_TO_SUPPLIER");
            po.setCreatedDate(new Date().toString());
            
            purchaseOrders.add(0, po);
            newOrders.add(po);

            // Refill stock to max capacity simulated
            for (PurchaseOrderItem orderItem : entry.getValue()) {
                for (BranchStock stock : branchStocks) {
                    if (stock.getBranchName().equals(orderItem.getBranchName()) && stock.getSku().equals(orderItem.getSku())) {
                        stock.setStock(stock.getMaxCapacity());
                    }
                }
            }
        }

        return newOrders;
    }

    public List<TransferSuggestion> checkTransferSuggestions(String sku, String requestingBranch) {
        List<TransferSuggestion> suggestions = new ArrayList<>();
        BranchStock requestStock = branchStocks.stream()
            .filter(b -> b.getBranchName().equals(requestingBranch) && b.getSku().equals(sku))
            .findFirst()
            .orElse(null);

        if (requestStock == null) return suggestions;

        for (BranchStock otherStock : branchStocks) {
            if (!otherStock.getBranchName().equals(requestingBranch) && otherStock.getSku().equals(sku)) {
                // If other branch has surplus (greater than reorder point)
                if (otherStock.getStock() > otherStock.getReorderPoint()) {
                    int surplus = otherStock.getStock() - otherStock.getReorderPoint();
                    TransferSuggestion sug = new TransferSuggestion();
                    sug.setSourceBranch(otherStock.getBranchName());
                    sug.setTargetBranch(requestingBranch);
                    sug.setSku(sku);
                    sug.setPartName(getPartNameBySku(sku));
                    sug.setAvailableQty(surplus);
                    sug.setDistanceKm(5.2);
                    sug.setEtaMinutes(25);
                    suggestions.add(sug);
                }
            }
        }

        return suggestions;
    }

    public boolean executeInternalTransfer(String sku, String sourceBranch, String targetBranch, int qty) {
        BranchStock source = branchStocks.stream()
            .filter(b -> b.getBranchName().equals(sourceBranch) && b.getSku().equals(sku))
            .findFirst()
            .orElse(null);

        BranchStock target = branchStocks.stream()
            .filter(b -> b.getBranchName().equals(targetBranch) && b.getSku().equals(sku))
            .findFirst()
            .orElse(null);

        if (source != null && target != null && source.getStock() >= qty) {
            source.setStock(source.getStock() - qty);
            target.setStock(target.getStock() + qty);
            return true;
        }

        return false;
    }

    private String getSupplierBySku(String sku) {
        if (sku.contains("BRAKE")) return "Bosch Automotive Parts Co.";
        if (sku.contains("OIL")) return "Mobil 1 Lubricants Dist.";
        return "General Market Supplier";
    }

    private String getPartNameBySku(String sku) {
        if (sku.contains("BRAKE")) return "Ceramic Brake Pads Set";
        if (sku.contains("OIL")) return "Fully Synthetic Engine Oil 10W-40";
        return "Automotive Replacement Part";
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class BranchStock {
        private String branchName;
        private String sku;
        private int stock;
        private int reorderPoint;
        private int maxCapacity;
    }

    @Getter
    @Setter
    public static class PurchaseOrder {
        private UUID id;
        private String poNumber;
        private String supplierName;
        private List<PurchaseOrderItem> items;
        private String status;
        private String createdDate;
    }

    @Getter
    @RequiredArgsConstructor
    public static class PurchaseOrderItem {
        private final String sku;
        private final String name;
        private final int quantity;
        private final String branchName;
    }

    @Getter
    @Setter
    public static class TransferSuggestion {
        private String sourceBranch;
        private String targetBranch;
        private String sku;
        private String partName;
        private int availableQty;
        private double distanceKm;
        private int etaMinutes;
    }
}
