package com.autoforge.modules.repairorder.repository;

import com.autoforge.modules.repairorder.model.RepairJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RepairJobRepository extends JpaRepository<RepairJob, UUID> {
    List<RepairJob> findAllByTenantIdAndRepairOrderId(UUID tenantId, UUID repairOrderId);
    List<RepairJob> findAllByTenantIdAndTechnicianId(UUID tenantId, UUID technicianId);
}
