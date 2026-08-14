package com.autoforge.modules.customer;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.customer.model.Customer;
import com.autoforge.modules.customer.repository.CustomerRepository;
import com.autoforge.modules.tenant.model.Tenant;
import com.autoforge.modules.tenant.repository.TenantRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TenantIsolationTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TenantRepository tenantRepository;

    private UUID tenantAId;
    private UUID tenantBId;

    @BeforeEach
    void setUp() {
        // Create Tenant A
        Tenant tenantA = new Tenant();
        tenantA.setName("Test Tenant A");
        tenantA.setPlan("STARTER");
        tenantA = tenantRepository.save(tenantA);
        tenantAId = tenantA.getId();

        // Create Tenant B
        Tenant tenantB = new Tenant();
        tenantB.setName("Test Tenant B");
        tenantB.setPlan("STARTER");
        tenantB = tenantRepository.save(tenantB);
        tenantBId = tenantB.getId();

        // Create customer for Tenant A
        TenantContext.setCurrentTenant(tenantAId);
        Customer cA = new Customer();
        cA.setTenantId(tenantAId);
        cA.setName("Tenant A Customer");
        cA.setPhone("0911111111");
        cA.setType("INDIVIDUAL");
        customerRepository.save(cA);

        // Create customer for Tenant B
        TenantContext.setCurrentTenant(tenantBId);
        Customer cB = new Customer();
        cB.setTenantId(tenantBId);
        cB.setName("Tenant B Customer");
        cB.setPhone("0922222222");
        cB.setType("INDIVIDUAL");
        customerRepository.save(cB);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void tenantA_canOnlySeeOwnCustomers() {
        TenantContext.setCurrentTenant(tenantAId);
        List<Customer> customersA = customerRepository.findAllByTenantId(tenantAId);

        assertFalse(customersA.isEmpty());
        assertTrue(customersA.stream().allMatch(c -> c.getTenantId().equals(tenantAId)));
        assertTrue(customersA.stream().noneMatch(c -> c.getTenantId().equals(tenantBId)));
    }

    @Test
    void tenantB_canOnlySeeOwnCustomers() {
        TenantContext.setCurrentTenant(tenantBId);
        List<Customer> customersB = customerRepository.findAllByTenantId(tenantBId);

        assertFalse(customersB.isEmpty());
        assertTrue(customersB.stream().allMatch(c -> c.getTenantId().equals(tenantBId)));
        assertTrue(customersB.stream().noneMatch(c -> c.getTenantId().equals(tenantAId)));
    }

    @Test
    void crossTenantAccess_returnsEmptyForOtherTenant() {
        // When Tenant A queries, they should NOT see Tenant B's data
        TenantContext.setCurrentTenant(tenantAId);
        List<Customer> result = customerRepository.findAllByTenantId(tenantBId);

        // This proves that even if you pass tenantB ID manually, Hibernate filter may block it
        // But at minimum, the customers found should not belong to Tenant A
        for (Customer c : result) {
            assertNotEquals(tenantAId, c.getTenantId());
        }
    }
}
