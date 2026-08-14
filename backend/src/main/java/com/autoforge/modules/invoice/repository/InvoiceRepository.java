package com.autoforge.modules.invoice.repository;

import com.autoforge.modules.invoice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findAllByTenantId(UUID tenantId);
    Optional<Invoice> findByTenantIdAndRepairOrderId(UUID tenantId, UUID repairOrderId);
}
