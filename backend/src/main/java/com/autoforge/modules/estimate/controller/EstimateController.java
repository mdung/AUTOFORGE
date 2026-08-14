package com.autoforge.modules.estimate.controller;

import com.autoforge.modules.estimate.model.Estimate;
import com.autoforge.modules.estimate.model.EstimateItem;
import com.autoforge.modules.estimate.service.EstimateService;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/estimates")
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;

    @GetMapping
    public ResponseEntity<List<Estimate>> getAllEstimates() {
        return ResponseEntity.ok(estimateService.getAllEstimates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estimate> getEstimateById(@PathVariable UUID id) {
        return ResponseEntity.ok(estimateService.getEstimateById(id));
    }

    @PostMapping
    public ResponseEntity<Estimate> createEstimate(@RequestBody Estimate estimate) {
        return ResponseEntity.ok(estimateService.createEstimate(estimate));
    }

    @GetMapping("/{estimateId}/items")
    public ResponseEntity<List<EstimateItem>> getEstimateItems(@PathVariable UUID estimateId) {
        return ResponseEntity.ok(estimateService.getEstimateItems(estimateId));
    }

    @PostMapping("/{estimateId}/items")
    public ResponseEntity<EstimateItem> addEstimateItem(@PathVariable UUID estimateId, @RequestBody EstimateItem item) {
        return ResponseEntity.ok(estimateService.addEstimateItem(estimateId, item));
    }

    @DeleteMapping("/{estimateId}/items/{itemId}")
    public ResponseEntity<Void> deleteEstimateItem(@PathVariable UUID estimateId, @PathVariable UUID itemId) {
        estimateService.deleteEstimateItem(estimateId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Estimate> submitApproval(@PathVariable UUID id, @RequestBody ApprovalRequest request) {
        Estimate updated = estimateService.submitApproval(id, request.getApprovedItemIds(), request.getSignature());
        return ResponseEntity.ok(updated);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Void> handleNotFound(IllegalArgumentException ex) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Void> handleForbidden(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @Getter
    @Setter
    public static class ApprovalRequest {
        private List<UUID> approvedItemIds;
        private String signature;
    }
}
