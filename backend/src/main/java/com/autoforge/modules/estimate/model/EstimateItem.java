package com.autoforge.modules.estimate.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "estimate_items")
@Getter
@Setter
public class EstimateItem extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "estimate_id", nullable = false)
    private UUID estimateId;

    @Column(nullable = false)
    private String name;

    @Column(name = "item_type", nullable = false)
    private String itemType; // LABOR, PART, FEE

    @Column(nullable = false)
    private Double quantity = 1.0;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice = 0.0;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, DECLINED

    @Column(name = "inspection_item_id")
    private UUID inspectionItemId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
