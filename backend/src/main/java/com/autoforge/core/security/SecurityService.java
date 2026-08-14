package com.autoforge.core.security;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.core.tenant.BranchContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service("securityService")
@Slf4j
public class SecurityService {

    public boolean hasAccess(UUID entityTenantId) {
        UUID currentTenant = TenantContext.getCurrentTenant();
        if (currentTenant == null || !currentTenant.equals(entityTenantId)) {
            log.warn("Access denied. Principal tenant: {}, requested resource tenant: {}", currentTenant, entityTenantId);
            return false;
        }
        return true;
    }

    public boolean hasBranchAccess(UUID entityBranchId) {
        UUID currentBranch = BranchContext.getCurrentBranch();
        if (currentBranch != null && !currentBranch.equals(entityBranchId)) {
            log.warn("Branch access denied. Principal branch: {}, requested resource branch: {}", currentBranch, entityBranchId);
            return false;
        }
        return true;
    }
}
