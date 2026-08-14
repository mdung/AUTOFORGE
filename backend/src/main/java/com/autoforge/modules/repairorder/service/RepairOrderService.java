package com.autoforge.modules.repairorder.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.repairorder.model.JobTimeEntry;
import com.autoforge.modules.repairorder.model.RepairJob;
import com.autoforge.modules.repairorder.model.RepairOrder;
import com.autoforge.modules.repairorder.repository.JobTimeEntryRepository;
import com.autoforge.modules.repairorder.repository.RepairJobRepository;
import com.autoforge.modules.repairorder.repository.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;
    private final RepairJobRepository repairJobRepository;
    private final JobTimeEntryRepository jobTimeEntryRepository;
    private final com.autoforge.core.business.BusinessRuleValidator businessRuleValidator;
    private final com.autoforge.modules.audit.event.DomainEventPublisher domainEventPublisher;
    private final com.autoforge.core.metrics.BusinessMetricsService businessMetricsService;
    private final com.autoforge.modules.quality.repository.QualityCheckRepository qualityCheckRepository;

    @Transactional(readOnly = true)
    public List<RepairOrder> getAllRepairOrders() {
        return repairOrderRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<RepairOrder> getAllRepairOrders(org.springframework.data.domain.Pageable pageable) {
        return repairOrderRepository.findAllByTenantId(TenantContext.getCurrentTenant(), pageable);
    }

    @Transactional(readOnly = true)
    public RepairOrder getRepairOrderById(UUID id) {
        RepairOrder ro = repairOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repair Order not found"));
        if (!ro.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return ro;
    }

    @Transactional(readOnly = true)
    public List<RepairJob> getJobsForOrder(UUID roId) {
        return repairJobRepository.findAllByTenantIdAndRepairOrderId(TenantContext.getCurrentTenant(), roId);
    }

    @Transactional(readOnly = true)
    public List<RepairJob> getJobsForTechnician(UUID techId) {
        return repairJobRepository.findAllByTenantIdAndTechnicianId(TenantContext.getCurrentTenant(), techId);
    }

    @Transactional
    public RepairOrder createRepairOrder(RepairOrder ro) {
        ro.setTenantId(TenantContext.getCurrentTenant());
        if (ro.getRoNumber() == null || ro.getRoNumber().isBlank()) {
            ro.setRoNumber("RO-" + System.currentTimeMillis() % 1000000);
        }
        RepairOrder saved = repairOrderRepository.save(ro);

        try {
            com.autoforge.modules.audit.event.DomainEvent event = new com.autoforge.modules.audit.event.DomainEvent(
                ro.getTenantId(),
                "advisor@autoforge.com",
                "CREATE_REPAIR_ORDER",
                "RepairOrder",
                saved.getId(),
                null,
                Map.of("roNumber", saved.getRoNumber(), "status", saved.getStatus())
            );
            domainEventPublisher.publish(event);
        } catch (Exception e) {
            // Ignore if event publisher throws error
        }

        try {
            businessMetricsService.incrementRepairOrders();
        } catch (Exception e) {
            // Ignore metrics error
        }

        return saved;
    }

    @Transactional
    public RepairOrder updateStatus(UUID id, String status) {
        RepairOrder ro = getRepairOrderById(id);
        businessRuleValidator.validateStateTransition(ro.getStatus(), status);

        if ("READY_FOR_DELIVERY".equals(status)) {
            List<com.autoforge.modules.quality.model.QualityCheck> checks = qualityCheckRepository.findAllByTenantIdAndRepairOrderId(ro.getTenantId(), id);
            boolean hasPassedQc = checks.stream().anyMatch(c -> "PASS".equalsIgnoreCase(c.getStatus()));
            if (!hasPassedQc) {
                throw new IllegalStateException("Giao xe bị chặn: Lệnh sửa chữa chưa hoàn thành hoặc chưa đạt bài kiểm duyệt chất lượng QC!");
            }
        }

        ro.setStatus(status);
        return repairOrderRepository.save(ro);
    }

    @Transactional
    public RepairJob addJob(UUID roId, RepairJob job) {
        job.setTenantId(TenantContext.getCurrentTenant());
        job.setRepairOrderId(roId);
        job.setStatus("PENDING");
        return repairJobRepository.save(job);
    }

    @Transactional
    public RepairJob assignTechnician(UUID jobId, UUID techId) {
        RepairJob job = repairJobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied");
        }
        job.setTechnicianId(techId);
        job.setStatus("ASSIGNED");
        return repairJobRepository.save(job);
    }

    @Transactional
    public JobTimeEntry startJobTimer(UUID jobId, UUID techId) {
        UUID tenantId = TenantContext.getCurrentTenant();
        RepairJob job = repairJobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.getTenantId().equals(tenantId)) {
            throw new SecurityException("Access Denied");
        }

        // ENFORCE CONSTRAINT: No overlapping active time entries for the same technician
        Optional<JobTimeEntry> active = jobTimeEntryRepository
                .findFirstByTenantIdAndTechnicianIdAndEndTimeIsNull(tenantId, techId);
        if (active.isPresent()) {
            throw new IllegalStateException("Technician already has an active timer running on job: " + active.get().getJobId());
        }

        job.setStatus("IN_PROGRESS");
        repairJobRepository.save(job);

        JobTimeEntry entry = new JobTimeEntry();
        entry.setTenantId(tenantId);
        entry.setJobId(jobId);
        entry.setTechnicianId(techId);
        entry.setStartTime(OffsetDateTime.now());
        return jobTimeEntryRepository.save(entry);
    }

    @Transactional
    public JobTimeEntry stopJobTimer(UUID jobId, UUID techId) {
        UUID tenantId = TenantContext.getCurrentTenant();
        JobTimeEntry active = jobTimeEntryRepository
                .findFirstByTenantIdAndTechnicianIdAndEndTimeIsNull(tenantId, techId)
                .orElseThrow(() -> new IllegalStateException("No active timer found for technician"));

        if (!active.getJobId().equals(jobId)) {
            throw new IllegalStateException("Active timer is running on a different job");
        }

        active.setEndTime(OffsetDateTime.now());
        JobTimeEntry saved = jobTimeEntryRepository.save(active);

        RepairJob job = repairJobRepository.findById(jobId).orElseThrow();
        job.setStatus("PAUSED");
        repairJobRepository.save(job);

        return saved;
    }

    @Transactional
    public RepairJob completeJob(UUID jobId) {
        RepairJob job = repairJobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied");
        }

        // Close any running timer
        Optional<JobTimeEntry> active = jobTimeEntryRepository
                .findFirstByTenantIdAndTechnicianIdAndEndTimeIsNull(TenantContext.getCurrentTenant(), job.getTechnicianId());
        if (active.isPresent()) {
            active.get().setEndTime(OffsetDateTime.now());
            jobTimeEntryRepository.save(active.get());
        }

        job.setStatus("COMPLETED");
        return repairJobRepository.save(job);
    }
}
