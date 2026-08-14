package com.autoforge.modules.parts.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "warranties")
@Getter
@Setter
public class Warranty {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String sku;

    @Column(name = "part_name", nullable = false)
    private String partName;

    @Column(name = "license_plate", nullable = false)
    private String licensePlate;

    @Column(name = "purchase_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date purchaseDate;

    @Column(name = "warranty_months", nullable = false)
    private int warrantyMonths;

    @Column(nullable = false)
    private String status; // ACTIVE, CLAIMED, EXPIRED

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
