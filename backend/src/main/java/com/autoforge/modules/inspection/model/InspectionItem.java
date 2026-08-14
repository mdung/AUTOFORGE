package com.autoforge.modules.inspection.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "inspection_items")
@Getter
@Setter
public class InspectionItem extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "inspection_id", nullable = false)
    private UUID inspectionId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // BRAKES, TIRES, SUSPENSION, FLUIDS, ELECTRICAL, ENGINE, AC

    @Column(nullable = false)
    private String status = "GOOD"; // GOOD, ATTENTION_SOON, REQUIRES_REPAIR, CRITICAL

    private String measurement;
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
