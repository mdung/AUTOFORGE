package com.autoforge.modules.parts.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "parts")
@Getter
@Setter
public class Part extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(name = "oem_number")
    private String oemNumber;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;

    @Column(nullable = false)
    private Double cost = 0.0;

    @Column(name = "selling_price", nullable = false)
    private Double sellingPrice = 0.0;

    @Column(name = "stock_qty", nullable = false)
    private Integer stockQty = 0;

    @Column(name = "reserved_qty", nullable = false)
    private Integer reservedQty = 0;

    @Column(name = "reorder_point", nullable = false)
    private Integer reorderPoint = 5;

    private String location;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}
