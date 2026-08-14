package com.autoforge.modules.vehicle.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
public class Vehicle extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(unique = true)
    private String vin;

    @Column(name = "license_plate", nullable = false)
    private String licensePlate;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    private String variant;
    private Integer year;

    @Column(nullable = false)
    private Integer mileage = 0;

    @Column(name = "engine_type", nullable = false)
    private String engineType = "ICE"; // ICE, HYBRID, PHEV, EV

    @Column(name = "fuel_type")
    private String fuelType;

    private String transmission;
    private String color;

    @Column(name = "last_service_date")
    private OffsetDateTime lastServiceDate;

    @Column(name = "next_service_date")
    private OffsetDateTime nextServiceDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}
