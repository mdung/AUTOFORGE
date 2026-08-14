package com.autoforge.modules.tenant.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "bays")
@Getter
@Setter
public class Bay extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type = "GENERAL"; // GENERAL, ALIGNMENT, LIFT, EV, DIAGNOSTIC, BODY, PAINT, TRUCK

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, BUSY, MAINTENANCE

    private String capability;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
