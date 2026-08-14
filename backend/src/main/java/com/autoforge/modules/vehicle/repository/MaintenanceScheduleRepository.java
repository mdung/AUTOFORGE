package com.autoforge.modules.vehicle.repository;

import com.autoforge.modules.vehicle.model.MaintenanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule, UUID> {
    List<MaintenanceSchedule> findByTenantId(UUID tenantId);
    List<MaintenanceSchedule> findByTenantIdAndVehicleId(UUID tenantId, UUID vehicleId);
}
