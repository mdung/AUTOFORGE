package com.autoforge.modules.vehicle.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "mileage_records")
@Getter
@Setter
public class MileageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "vehicle_id", nullable = false)
    private UUID vehicleId;

    @Column(name = "odometer_reading", nullable = false)
    private int odometerReading;

    @Column(name = "recorded_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date recordedDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
