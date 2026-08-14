package com.autoforge.modules.parts.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "purchase_order_items")
@Getter
@Setter
public class PurchaseOrderItem extends AbstractTenantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @Column(name = "purchase_order_id", nullable = false)
    private UUID purchaseOrderId;

    @NotNull
    @Column(name = "part_id", nullable = false)
    private UUID partId;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "unit_cost", nullable = false)
    private Double unitCost;

    @Column(name = "received_quantity")
    private Integer receivedQuantity = 0;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
