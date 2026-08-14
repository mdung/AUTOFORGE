package com.autoforge.modules.audit.event;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Getter
@RequiredArgsConstructor
public class DomainEvent {
    private final UUID tenantId;
    private final String actor;
    private final String action;
    private final String entityType;
    private final UUID entityId;
    private final Map<String, Object> beforeState;
    private final Map<String, Object> afterState;
}
