package com.autoforge.modules.estimate.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "estimates")
@Getter
@Setter
public class Estimate extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "repair_order_id", nullable = false)
    private UUID repairOrderId;

    @Column(nullable = false)
    private String status = "DRAFT"; // DRAFT, SENT, APPROVED, PARTIALLY_APPROVED, DECLINED

    @Column(name = "tax_rate")
    private Double taxRate = 0.0;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "total_price")
    private Double totalPrice = 0.0;

    @Column(columnDefinition = "TEXT")
    private String terms;

    @Column(name = "approval_timestamp")
    private OffsetDateTime approvalTimestamp;

    @Column(name = "approval_signature")
    private String approvalSignature;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}
