package com.autoforge.modules.repairorder.repository;

import com.autoforge.modules.repairorder.model.LaborCatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LaborCatalogItemRepository extends JpaRepository<LaborCatalogItem, UUID> {
    List<LaborCatalogItem> findByTenantId(UUID tenantId);
}
