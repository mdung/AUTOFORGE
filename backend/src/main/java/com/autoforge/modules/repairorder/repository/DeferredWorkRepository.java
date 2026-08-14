package com.autoforge.modules.repairorder.repository;

import com.autoforge.modules.repairorder.model.DeferredWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeferredWorkRepository extends JpaRepository<DeferredWork, UUID> {
    List<DeferredWork> findByTenantId(UUID tenantId);
    List<DeferredWork> findByTenantIdAndVehicleId(UUID tenantId, UUID vehicleId);
}
