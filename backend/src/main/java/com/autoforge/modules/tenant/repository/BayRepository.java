package com.autoforge.modules.tenant.repository;

import com.autoforge.modules.tenant.model.Bay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BayRepository extends JpaRepository<Bay, UUID> {
    List<Bay> findAllByTenantId(UUID tenantId);
    List<Bay> findAllByTenantIdAndBranchId(UUID tenantId, UUID branchId);
}
