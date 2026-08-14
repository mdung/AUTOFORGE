package com.autoforge.modules.tenant.repository;

import com.autoforge.modules.tenant.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BranchRepository extends JpaRepository<Branch, UUID> {
    List<Branch> findAllByTenantId(UUID tenantId);
}
