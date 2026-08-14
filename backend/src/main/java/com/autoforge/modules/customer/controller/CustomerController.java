package com.autoforge.modules.customer.controller;

import com.autoforge.modules.customer.model.Customer;
import com.autoforge.modules.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<Customer>> getAllCustomersPaginated(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(customerService.getAllCustomers(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam String query) {
        return ResponseEntity.ok(customerService.searchCustomers(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable UUID id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN')")
    public ResponseEntity<Customer> createCustomer(@jakarta.validation.Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN')")
    public ResponseEntity<Customer> updateCustomer(@PathVariable UUID id, @jakarta.validation.Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }
}
