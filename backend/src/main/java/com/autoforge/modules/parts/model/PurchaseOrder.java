package com.autoforge.modules.parts.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
public class PurchaseOrder extends AbstractTenantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @Column(name = "supplier_id", nullable = false)
    private UUID supplierId;

    @NotBlank
    @Column(name = "po_number", nullable = false, unique = true)
    private String poNumber;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PurchaseOrderStatus status = PurchaseOrderStatus.DRAFT;

    private OffsetDateTime eta;

    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;

    public enum PurchaseOrderStatus {
        DRAFT, SENT, PARTIALLY_RECEIVED, RECEIVED, CANCELLED
    }
}
