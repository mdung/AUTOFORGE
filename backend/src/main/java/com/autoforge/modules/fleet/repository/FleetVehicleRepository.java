package com.autoforge.modules.fleet.repository;

import com.autoforge.modules.fleet.model.FleetVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FleetVehicleRepository extends JpaRepository<FleetVehicle, UUID> {
    List<FleetVehicle> findByTenantId(UUID tenantId);
    List<FleetVehicle> findByTenantIdAndFleetId(UUID tenantId, UUID fleetId);
}
