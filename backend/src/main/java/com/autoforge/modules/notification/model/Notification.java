package com.autoforge.modules.notification.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type; // CHECKIN, DVI, READY, SYSTEM

    @Column(nullable = false)
    private String channel; // EMAIL, SMS, PUSH, ZALO

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String status; // SENT, FAILED

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
