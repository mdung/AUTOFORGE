package com.autoforge.modules.fleet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "fleet_policies")
@Getter
@Setter
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "fleet_id", nullable = false)
    private UUID fleetId;

    @Column(name = "policy_number", nullable = false)
    private String policyNumber;

    @Column(name = "coverage_details")
    private String coverageDetails;

    @Column(name = "expiry_date")
    @Temporal(TemporalType.DATE)
    private Date expiryDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
