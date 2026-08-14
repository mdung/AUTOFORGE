package com.autoforge.modules.repairorder.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "repair_jobs")
@Getter
@Setter
public class RepairJob extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "repair_order_id", nullable = false)
    private UUID repairOrderId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    @Column(name = "labor_hours")
    private Double laborHours = 0.0;

    @Column(name = "technician_id")
    private UUID technicianId;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ASSIGNED, IN_PROGRESS, PAUSED, WAITING_PARTS, COMPLETED, QC_FAILED, VERIFIED

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}
