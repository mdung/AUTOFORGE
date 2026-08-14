package com.autoforge.modules.estimate.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.estimate.model.Estimate;
import com.autoforge.modules.estimate.model.EstimateItem;
import com.autoforge.modules.estimate.repository.EstimateItemRepository;
import com.autoforge.modules.estimate.repository.EstimateRepository;
import com.autoforge.modules.audit.event.DomainEvent;
import com.autoforge.modules.audit.event.DomainEventPublisher;
import com.autoforge.modules.repairorder.model.RepairJob;
import com.autoforge.modules.repairorder.model.RepairOrder;
import com.autoforge.modules.repairorder.repository.RepairJobRepository;
import com.autoforge.modules.repairorder.repository.RepairOrderRepository;
import com.autoforge.modules.parts.model.Part;
import com.autoforge.modules.parts.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final EstimateItemRepository estimateItemRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final RepairJobRepository repairJobRepository;
    private final PartRepository partRepository;
    private final DomainEventPublisher domainEventPublisher;

    @Transactional(readOnly = true)
    public List<Estimate> getAllEstimates() {
        return estimateRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public Estimate getEstimateById(UUID id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Estimate not found"));
        if (!estimate.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return estimate;
    }

    @Transactional(readOnly = true)
    public List<EstimateItem> getEstimateItems(UUID estimateId) {
        return estimateItemRepository.findAllByTenantIdAndEstimateId(TenantContext.getCurrentTenant(), estimateId);
    }

    @Transactional
    public Estimate createEstimate(Estimate estimate) {
        estimate.setTenantId(TenantContext.getCurrentTenant());
        estimate.setStatus("DRAFT");
        Estimate saved = estimateRepository.save(estimate);
        
        try {
            domainEventPublisher.publish(new DomainEvent(
                TenantContext.getCurrentTenant(),
                getCurrentActor(),
                "ESTIMATE_CREATED",
                "Estimate",
                saved.getId(),
                null,
                Map.of("repairOrderId", saved.getRepairOrderId().toString(), "status", "DRAFT")
            ));
        } catch (Exception e) { /* ignore */ }
        
        return saved;
    }

    @Transactional
    public EstimateItem addEstimateItem(UUID estimateId, EstimateItem item) {
        UUID tenantId = TenantContext.getCurrentTenant();
        item.setTenantId(tenantId);
        item.setEstimateId(estimateId);
        item.setStatus("PENDING");
        EstimateItem saved = estimateItemRepository.save(item);
        
        recalculateTotal(estimateId);
        return saved;
    }

    @Transactional
    public void deleteEstimateItem(UUID estimateId, UUID itemId) {
        EstimateItem item = estimateItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (!item.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied");
        }
        estimateItemRepository.delete(item);
        recalculateTotal(estimateId);
    }

    private void recalculateTotal(UUID estimateId) {
        List<EstimateItem> items = estimateItemRepository.findAllByTenantIdAndEstimateId(TenantContext.getCurrentTenant(), estimateId);
        double subtotal = 0.0;
        for (EstimateItem item : items) {
            subtotal += item.getUnitPrice() * item.getQuantity();
        }
        Estimate estimate = getEstimateById(estimateId);
        double tax = subtotal * estimate.getTaxRate();
        estimate.setTotalPrice(subtotal + tax - estimate.getDiscountAmount());
        estimateRepository.save(estimate);
    }

    @Transactional
    public Estimate submitApproval(UUID id, List<UUID> approvedItemIds, String signature) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Estimate estimate = getEstimateById(id);
        List<EstimateItem> items = getEstimateItems(id);

        boolean hasApproved = false;
        boolean hasDeclined = false;

        for (EstimateItem item : items) {
            if (approvedItemIds.contains(item.getId())) {
                item.setStatus("APPROVED");
                hasApproved = true;
                
                // If it's a LABOR item, auto-generate a Job on the Repair Order
                if ("LABOR".equalsIgnoreCase(item.getItemType())) {
                    createJobFromEstimateItem(estimate.getRepairOrderId(), item);
                } else if ("PART".equalsIgnoreCase(item.getItemType())) {
                    // For part items, reserve quantity from parts inventory if SKU matches
                    // We search parts catalog by SKU or name
                    // Since it's a demo, we look up a part with the same name or sku, and increment reserved_qty
                    List<Part> parts = partRepository.findAllByTenantId(tenantId);
                    for (Part p : parts) {
                        if (p.getName().equalsIgnoreCase(item.getName()) || p.getSku().equalsIgnoreCase(item.getName())) {
                            p.setReservedQty(p.getReservedQty() + item.getQuantity().intValue());
                            partRepository.save(p);
                        }
                    }
                }
            } else {
                item.setStatus("DECLINED");
                hasDeclined = true;
            }
            estimateItemRepository.save(item);
        }

        estimate.setStatus(hasApproved && hasDeclined ? "PARTIALLY_APPROVED" : (hasApproved ? "APPROVED" : "DECLINED"));
        estimate.setApprovalTimestamp(OffsetDateTime.now());
        estimate.setApprovalSignature(signature);
        Estimate saved = estimateRepository.save(estimate);

        // Update RO status
        RepairOrder ro = repairOrderRepository.findById(estimate.getRepairOrderId())
                .orElseThrow(() -> new IllegalArgumentException("RO not found"));
        ro.setStatus("APPROVED");
        repairOrderRepository.save(ro);

        try {
            domainEventPublisher.publish(new DomainEvent(
                TenantContext.getCurrentTenant(),
                getCurrentActor(),
                "ESTIMATE_APPROVED",
                "Estimate",
                saved.getId(),
                Map.of("status", "DRAFT"),
                Map.of("status", saved.getStatus(), "signature", signature != null ? signature : "")
            ));
        } catch (Exception e) { /* ignore */ }

        return saved;
    }

    private String getCurrentActor() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "system";
    }

    private void createJobFromEstimateItem(UUID roId, EstimateItem item) {
        RepairJob job = new RepairJob();
        job.setTenantId(TenantContext.getCurrentTenant());
        job.setRepairOrderId(roId);
        job.setName(item.getName());
        job.setDescription("Labor operation from approved estimate: " + item.getName());
        job.setCategory("GENERAL");
        job.setLaborHours(item.getQuantity());
        job.setStatus("PENDING");
        repairJobRepository.save(job);
    }
}
