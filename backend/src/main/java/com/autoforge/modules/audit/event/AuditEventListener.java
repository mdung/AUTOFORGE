package com.autoforge.modules.audit.event;

import com.autoforge.modules.audit.model.AuditEvent;
import com.autoforge.modules.audit.repository.AuditEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditEventListener {

    private final AuditEventRepository auditEventRepository;

    @EventListener
    public void handleDomainEvent(DomainEvent event) {
        AuditEvent audit = new AuditEvent();
        audit.setTenantId(event.getTenantId());
        audit.setActor(event.getActor());
        audit.setAction(event.getAction());
        audit.setEntityType(event.getEntityType());
        audit.setEntityId(event.getEntityId());
        audit.setBeforeState(event.getBeforeState());
        audit.setAfterState(event.getAfterState());
        
        auditEventRepository.save(audit);
    }
}
