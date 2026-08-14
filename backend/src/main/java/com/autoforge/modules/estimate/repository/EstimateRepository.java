package com.autoforge.modules.estimate.repository;

import com.autoforge.modules.estimate.model.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EstimateRepository extends JpaRepository<Estimate, UUID> {
    List<Estimate> findAllByTenantId(UUID tenantId);
    Optional<Estimate> findByTenantIdAndRepairOrderId(UUID tenantId, UUID repairOrderId);
}
