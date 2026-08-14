package com.autoforge.modules.repairorder.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "deferred_works")
@Getter
@Setter
public class DeferredWork {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "vehicle_id", nullable = false)
    private UUID vehicleId;

    @Column(nullable = false)
    private String recommendation;

    @Column(nullable = false)
    private String category; // BRAKES, TIRES, SUSPENSION, etc.

    @Column(name = "estimated_cost")
    private double estimatedCost;

    @Column(name = "deferred_reason")
    private String deferredReason;

    @Column(nullable = false)
    private String status; // DEFERRED, APPROVED, DECLINED

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
