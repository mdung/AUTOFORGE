package com.autoforge.modules.quality.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "quality_checks")
@Getter
@Setter
public class QualityCheck extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "repair_order_id", nullable = false)
    private UUID repairOrderId;

    @Column(name = "inspector_id", nullable = false)
    private UUID inspectorId;

    @Column(nullable = false)
    private String status = "PASS"; // PASS, FAIL

    @Column(name = "road_tested")
    private Boolean roadTested = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "signature_url")
    private String signatureUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
