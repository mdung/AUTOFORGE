package com.autoforge.modules.fleet.repository;

import com.autoforge.modules.fleet.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {
    List<Policy> findByTenantId(UUID tenantId);
    List<Policy> findByTenantIdAndFleetId(UUID tenantId, UUID fleetId);
}
