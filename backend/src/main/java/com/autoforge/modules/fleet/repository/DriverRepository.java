package com.autoforge.modules.fleet.repository;

import com.autoforge.modules.fleet.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {
    List<Driver> findByTenantId(UUID tenantId);
    List<Driver> findByTenantIdAndFleetId(UUID tenantId, UUID fleetId);
}
