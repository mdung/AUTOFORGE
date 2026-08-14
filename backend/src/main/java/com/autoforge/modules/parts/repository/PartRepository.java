package com.autoforge.modules.parts.repository;

import com.autoforge.modules.parts.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PartRepository extends JpaRepository<Part, UUID> {
    List<Part> findAllByTenantId(UUID tenantId);
    org.springframework.data.domain.Page<Part> findAllByTenantId(UUID tenantId, org.springframework.data.domain.Pageable pageable);
    Optional<Part> findByTenantIdAndSku(UUID tenantId, String sku);
}
