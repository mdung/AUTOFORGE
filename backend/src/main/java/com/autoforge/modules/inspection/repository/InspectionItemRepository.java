package com.autoforge.modules.inspection.repository;

import com.autoforge.modules.inspection.model.InspectionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InspectionItemRepository extends JpaRepository<InspectionItem, UUID> {
    List<InspectionItem> findAllByTenantIdAndInspectionId(UUID tenantId, UUID inspectionId);
}
