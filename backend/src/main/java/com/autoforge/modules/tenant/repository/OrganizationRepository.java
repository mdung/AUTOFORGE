package com.autoforge.modules.tenant.repository;

import com.autoforge.modules.tenant.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    List<Organization> findAllByTenantId(UUID tenantId);
}
