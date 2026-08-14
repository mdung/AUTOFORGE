package com.autoforge.modules.parts.controller;

import com.autoforge.modules.parts.model.PurchaseOrder;
import com.autoforge.modules.parts.model.PurchaseOrder.PurchaseOrderStatus;
import com.autoforge.modules.parts.model.PurchaseOrderItem;
import com.autoforge.modules.parts.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAll() {
        return ResponseEntity.ok(purchaseOrderService.getAllForTenant());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_PARTS_MANAGER', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<PurchaseOrder> create(@Valid @RequestBody PurchaseOrder purchaseOrder) {
        return ResponseEntity.ok(purchaseOrderService.create(purchaseOrder));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_PARTS_MANAGER', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<PurchaseOrder> updateStatus(
            @PathVariable UUID id,
            @RequestParam PurchaseOrderStatus status) {
        return ResponseEntity.ok(purchaseOrderService.updateStatus(id, status));
    }

    @PostMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('ROLE_PARTS_MANAGER', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<PurchaseOrder> receiveGoods(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.receiveGoods(id));
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<PurchaseOrderItem>> getItems(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.getItems(id));
    }

    @PostMapping("/{id}/items")
    @PreAuthorize("hasAnyRole('ROLE_PARTS_MANAGER', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<PurchaseOrderItem> addItem(
            @PathVariable UUID id,
            @Valid @RequestBody PurchaseOrderItem item) {
        return ResponseEntity.ok(purchaseOrderService.addItem(id, item));
    }
}
