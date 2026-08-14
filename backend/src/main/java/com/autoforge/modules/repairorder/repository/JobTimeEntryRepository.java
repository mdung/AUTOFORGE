package com.autoforge.modules.repairorder.repository;

import com.autoforge.modules.repairorder.model.JobTimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobTimeEntryRepository extends JpaRepository<JobTimeEntry, UUID> {
    List<JobTimeEntry> findAllByTenantIdAndJobId(UUID tenantId, UUID jobId);
    Optional<JobTimeEntry> findFirstByTenantIdAndTechnicianIdAndEndTimeIsNull(UUID tenantId, UUID technicianId);
}
