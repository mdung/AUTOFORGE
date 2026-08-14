package com.autoforge.modules.future.controller;

import com.autoforge.modules.future.service.SupplyChainService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supply-chain")
@RequiredArgsConstructor
public class SupplyChainController {

    private final SupplyChainService supplyChainService;

    @GetMapping("/purchase-orders")
    public ResponseEntity<List<SupplyChainService.PurchaseOrder>> getPurchaseOrders() {
        return ResponseEntity.ok(supplyChainService.getPurchaseOrders());
    }

    @GetMapping("/branch-stocks")
    public ResponseEntity<List<SupplyChainService.BranchStock>> getBranchStocks() {
        return ResponseEntity.ok(supplyChainService.getBranchStocks());
    }

    @PostMapping("/replenish")
    public ResponseEntity<List<SupplyChainService.PurchaseOrder>> triggerReplenish() {
        return ResponseEntity.ok(supplyChainService.triggerAutoReplenishment());
    }

    @GetMapping("/transfers/suggest")
    public ResponseEntity<List<SupplyChainService.TransferSuggestion>> getSuggestions(
            @RequestParam String sku,
            @RequestParam String requestingBranch) {
        return ResponseEntity.ok(supplyChainService.checkTransferSuggestions(sku, requestingBranch));
    }

    @PostMapping("/transfers/execute")
    public ResponseEntity<String> executeTransfer(@RequestBody TransferPayload payload) {
        boolean success = supplyChainService.executeInternalTransfer(
            payload.getSku(),
            payload.getSourceBranch(),
            payload.getTargetBranch(),
            payload.getQuantity()
        );
        if (success) {
            return ResponseEntity.ok("Internal transfer executed successfully");
        } else {
            return ResponseEntity.badRequest().body("Transfer execution failed. Inadequate stock levels.");
        }
    }

    @Getter
    @Setter
    public static class TransferPayload {
        private String sku;
        private String sourceBranch;
        private String targetBranch;
        private int quantity;
    }
}
