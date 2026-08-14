package com.autoforge.modules.checkin.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "check_ins")
@Getter
@Setter
public class CheckIn extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "appointment_id")
    private UUID appointmentId;

    @Column(name = "vehicle_id", nullable = false)
    private UUID vehicleId;

    @Column(name = "advisor_id", nullable = false)
    private UUID advisorId;

    @Column(nullable = false)
    private Integer mileage;

    @Column(name = "fuel_level")
    private String fuelLevel;

    @Column(name = "signature_url")
    private String signatureUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
