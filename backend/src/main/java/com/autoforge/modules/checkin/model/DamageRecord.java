package com.autoforge.modules.checkin.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "damage_records")
@Getter
@Setter
public class DamageRecord extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "check_in_id", nullable = false)
    private UUID checkInId;

    @Column(nullable = false)
    private String component; // FRONT, REAR, LEFT, RIGHT, ROOF, WHEELS

    @Column(name = "x_coord", nullable = false)
    private Double xCoord;

    @Column(name = "y_coord", nullable = false)
    private Double yCoord;

    @Column(name = "damage_type", nullable = false)
    private String damageType; // SCRATCH, DENT, CRACK, DAMAGE, MISSING

    @Column(name = "photo_url")
    private String photoUrl;

    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
