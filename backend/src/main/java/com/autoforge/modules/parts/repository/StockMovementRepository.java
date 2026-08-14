package com.autoforge.modules.parts.repository;

import com.autoforge.modules.parts.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findAllByTenantId(UUID tenantId);
    List<StockMovement> findAllByTenantIdAndPartId(UUID tenantId, UUID partId);
}
