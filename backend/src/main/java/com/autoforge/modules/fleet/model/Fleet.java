package com.autoforge.modules.fleet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "fleets")
@Getter
@Setter
public class Fleet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(nullable = false)
    private String email;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
