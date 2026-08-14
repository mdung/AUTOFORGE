package com.autoforge.modules.parts.repository;

import com.autoforge.modules.parts.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    List<PurchaseOrder> findAllByTenantId(UUID tenantId);
    Optional<PurchaseOrder> findByTenantIdAndPoNumber(UUID tenantId, String poNumber);
}
