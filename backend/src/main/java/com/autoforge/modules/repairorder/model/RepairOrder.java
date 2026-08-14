package com.autoforge.modules.repairorder.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "repair_orders")
@Getter
@Setter
public class RepairOrder extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "ro_number", nullable = false, unique = true)
    private String roNumber;

    @Column(name = "customer_id", nullable = false)
    @NotNull(message = "Customer ID cannot be null")
    private UUID customerId;

    @Column(name = "vehicle_id", nullable = false)
    @NotNull(message = "Vehicle ID cannot be null")
    private UUID vehicleId;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @Column(name = "advisor_id", nullable = false)
    private UUID advisorId;

    @Column(name = "bay_id")
    private UUID bayId;

    @Column(nullable = false)
    private String status = "DRAFT"; // DRAFT, CHECKED_IN, INSPECTION, WAITING_APPROVAL, APPROVED, READY_FOR_WORK, IN_PROGRESS, QUALITY_CONTROL, READY_FOR_DELIVERY, DELIVERED, CLOSED, CANCELLED

    @Column(nullable = false)
    private Integer mileage;

    @Column(name = "promised_time")
    private OffsetDateTime promisedTime;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}
