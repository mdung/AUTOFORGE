package com.autoforge.modules.inspection.repository;

import com.autoforge.modules.inspection.model.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InspectionRepository extends JpaRepository<Inspection, UUID> {
    List<Inspection> findAllByTenantId(UUID tenantId);
}
