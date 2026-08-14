package com.autoforge.modules.vehicle.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "maintenance_schedules")
@Getter
@Setter
public class MaintenanceSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "vehicle_id", nullable = false)
    private UUID vehicleId;

    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @Column(name = "interval_km", nullable = false)
    private int intervalKm;

    @Column(name = "interval_months", nullable = false)
    private int intervalMonths;

    @Column(name = "next_due_km", nullable = false)
    private int nextDueKm;

    @Column(name = "next_due_date")
    @Temporal(TemporalType.DATE)
    private Date nextDueDate;

    @Column(nullable = false)
    private String status; // SCHEDULED, COMPLETED, OVERDUE

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
