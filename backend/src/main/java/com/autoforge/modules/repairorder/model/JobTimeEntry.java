package com.autoforge.modules.repairorder.model;

import com.autoforge.core.model.AbstractTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_time_entries")
@Getter
@Setter
public class JobTimeEntry extends AbstractTenantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "job_id", nullable = false)
    private UUID jobId;

    @Column(name = "technician_id", nullable = false)
    private UUID technicianId;

    @Column(name = "start_time", nullable = false)
    private OffsetDateTime startTime;

    @Column(name = "end_time")
    private OffsetDateTime endTime;

    @Column(name = "paused_duration")
    private Integer pausedDuration = 0; // in seconds

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
