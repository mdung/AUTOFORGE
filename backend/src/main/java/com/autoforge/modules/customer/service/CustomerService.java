package com.autoforge.modules.customer.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.customer.model.Customer;
import com.autoforge.modules.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<Customer> getAllCustomers(org.springframework.data.domain.Pageable pageable) {
        return customerRepository.findAllByTenantId(TenantContext.getCurrentTenant(), pageable);
    }

    @Transactional(readOnly = true)
    public List<Customer> searchCustomers(String query) {
        return customerRepository.searchCustomers(TenantContext.getCurrentTenant(), query);
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        // Ensure tenant isolation
        if (!customer.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return customer;
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        customer.setTenantId(TenantContext.getCurrentTenant());
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(UUID id, Customer details) {
        Customer customer = getCustomerById(id);
        customer.setName(details.getName());
        customer.setEmail(details.getEmail());
        customer.setPhone(details.getPhone());
        customer.setAddress(details.getAddress());
        customer.setType(details.getType());
        customer.setNotes(details.getNotes());
        return customerRepository.save(customer);
    }
}
