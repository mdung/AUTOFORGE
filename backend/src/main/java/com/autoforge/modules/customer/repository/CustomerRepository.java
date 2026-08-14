package com.autoforge.modules.customer.repository;

import com.autoforge.modules.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findAllByTenantId(UUID tenantId);
    org.springframework.data.domain.Page<Customer> findAllByTenantId(UUID tenantId, org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.tenantId = :tenantId AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Customer> searchCustomers(UUID tenantId, String query);
}
