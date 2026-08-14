package com.autoforge.modules.estimate.repository;

import com.autoforge.modules.estimate.model.EstimateItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EstimateItemRepository extends JpaRepository<EstimateItem, UUID> {
    List<EstimateItem> findAllByTenantIdAndEstimateId(UUID tenantId, UUID estimateId);
}
