package com.autoforge.modules.repairorder.repository;

import com.autoforge.modules.repairorder.model.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, UUID> {
    List<RepairOrder> findAllByTenantId(UUID tenantId);
    org.springframework.data.domain.Page<RepairOrder> findAllByTenantId(UUID tenantId, org.springframework.data.domain.Pageable pageable);
    Optional<RepairOrder> findByTenantIdAndRoNumber(UUID tenantId, String roNumber);
    List<RepairOrder> findAllByTenantIdAndBranchId(UUID tenantId, UUID branchId);
}
