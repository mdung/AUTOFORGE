package com.autoforge.modules.quality.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.quality.model.QualityCheck;
import com.autoforge.modules.quality.repository.QualityCheckRepository;
import com.autoforge.modules.repairorder.service.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QualityCheckService {

    private final QualityCheckRepository qualityCheckRepository;
    private final RepairOrderService repairOrderService;

    @Transactional(readOnly = true)
    public List<QualityCheck> getQualityChecksForRO(UUID roId) {
        return qualityCheckRepository.findAllByTenantIdAndRepairOrderId(TenantContext.getCurrentTenant(), roId);
    }

    @Transactional
    public QualityCheck performQualityCheck(QualityCheck check) {
        UUID tenantId = TenantContext.getCurrentTenant();
        check.setTenantId(tenantId);
        QualityCheck saved = qualityCheckRepository.save(check);

        // Update RO status
        if ("PASS".equalsIgnoreCase(check.getStatus())) {
            repairOrderService.updateStatus(check.getRepairOrderId(), "READY_FOR_DELIVERY");
        } else {
            repairOrderService.updateStatus(check.getRepairOrderId(), "QUALITY_CONTROL"); // stays in QC/Rework
        }

        return saved;
    }
}
