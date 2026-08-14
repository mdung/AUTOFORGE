package com.autoforge.modules.repairorder.controller;

import com.autoforge.modules.repairorder.model.JobTimeEntry;
import com.autoforge.modules.repairorder.model.RepairJob;
import com.autoforge.modules.repairorder.model.RepairOrder;
import com.autoforge.modules.repairorder.service.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/repairorders")
@RequiredArgsConstructor
public class RepairOrderController {

    private final RepairOrderService repairOrderService;
    private final com.autoforge.core.security.SecurityService securityService;

    @GetMapping
    public ResponseEntity<List<RepairOrder>> getAllRepairOrders() {
        return ResponseEntity.ok(repairOrderService.getAllRepairOrders());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<RepairOrder>> getAllRepairOrdersPaginated(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(repairOrderService.getAllRepairOrders(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepairOrder> getRepairOrderById(@PathVariable UUID id) {
        RepairOrder ro = repairOrderService.getRepairOrderById(id);
        if (!securityService.hasBranchAccess(ro.getBranchId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to this branch");
        }
        return ResponseEntity.ok(ro);
    }

    @GetMapping("/{id}/jobs")
    public ResponseEntity<List<RepairJob>> getJobsForOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(repairOrderService.getJobsForOrder(id));
    }

    @GetMapping("/technician/{techId}")
    public ResponseEntity<List<RepairJob>> getJobsForTechnician(@PathVariable UUID techId) {
        return ResponseEntity.ok(repairOrderService.getJobsForTechnician(techId));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN')")
    public ResponseEntity<RepairOrder> createRepairOrder(@jakarta.validation.Valid @RequestBody RepairOrder ro) {
        if (!securityService.hasBranchAccess(ro.getBranchId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to this branch");
        }
        return ResponseEntity.ok(repairOrderService.createRepairOrder(ro));
    }

    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN', 'ROLE_CASHIER')")
    public ResponseEntity<RepairOrder> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        RepairOrder ro = repairOrderService.getRepairOrderById(id);
        if (!securityService.hasBranchAccess(ro.getBranchId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to this branch");
        }
        return ResponseEntity.ok(repairOrderService.updateStatus(id, status));
    }

    @PostMapping("/{id}/jobs")
    public ResponseEntity<RepairJob> addJob(@PathVariable UUID id, @RequestBody RepairJob job) {
        return ResponseEntity.ok(repairOrderService.addJob(id, job));
    }

    @PutMapping("/jobs/{jobId}/assign")
    public ResponseEntity<RepairJob> assignTechnician(@PathVariable UUID jobId, @RequestParam UUID techId) {
        return ResponseEntity.ok(repairOrderService.assignTechnician(jobId, techId));
    }

    @PostMapping("/jobs/{jobId}/start")
    public ResponseEntity<JobTimeEntry> startJobTimer(@PathVariable UUID jobId, @RequestParam UUID techId) {
        return ResponseEntity.ok(repairOrderService.startJobTimer(jobId, techId));
    }

    @PostMapping("/jobs/{jobId}/stop")
    public ResponseEntity<JobTimeEntry> stopJobTimer(@PathVariable UUID jobId, @RequestParam UUID techId) {
        return ResponseEntity.ok(repairOrderService.stopJobTimer(jobId, techId));
    }

    @PutMapping("/jobs/{jobId}/complete")
    public ResponseEntity<RepairJob> completeJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(repairOrderService.completeJob(jobId));
    }
}
