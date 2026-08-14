package com.autoforge.modules.quality.repository;

import com.autoforge.modules.quality.model.QualityCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QualityCheckRepository extends JpaRepository<QualityCheck, UUID> {
    List<QualityCheck> findAllByTenantIdAndRepairOrderId(UUID tenantId, UUID repairOrderId);
}
