package com.autoforge.modules.invoice.repository;

import com.autoforge.modules.invoice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findAllByTenantIdAndInvoiceId(UUID tenantId, UUID invoiceId);
}
