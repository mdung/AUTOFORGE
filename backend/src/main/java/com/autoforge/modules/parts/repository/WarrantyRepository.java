package com.autoforge.modules.parts.repository;

import com.autoforge.modules.parts.model.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, UUID> {
    List<Warranty> findByTenantId(UUID tenantId);
    Optional<Warranty> findByTenantIdAndSkuAndLicensePlate(UUID tenantId, String sku, String licensePlate);
}
