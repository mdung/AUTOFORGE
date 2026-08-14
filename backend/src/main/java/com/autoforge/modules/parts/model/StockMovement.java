package com.autoforge.modules.parts.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_stock_movements")
@Getter
@Setter
public class StockMovement extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "part_id", nullable = false)
    private UUID partId;

    @Column(name = "movement_type", nullable = false)
    private String movementType; // RECEIPT, CONSUMPTION, ADJUSTMENT, RETURN, RESERVATION_ADD, RESERVATION_REMOVE

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_cost", nullable = false)
    private Double unitCost;

    @Column(name = "reference_id")
    private UUID referenceId;

    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
