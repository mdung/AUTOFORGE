package com.autoforge.core.tenant;

import jakarta.persistence.EntityManager;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
public class TenantFilterAspect {

    @Autowired
    private EntityManager entityManager;

    @Before("execution(* com.autoforge.modules..*.repository..*(..))")
    public void beforeRepositoryMethod() {
        UUID tenantId = TenantContext.getCurrentTenant();
        if (tenantId != null) {
            try {
                Session session = entityManager.unwrap(Session.class);
                session.enableFilter("tenantFilter").setParameter("tenantId", tenantId);
            } catch (Exception e) {
                // Fail-safe if session is not active or unwrap fails
            }
        }
    }
}
