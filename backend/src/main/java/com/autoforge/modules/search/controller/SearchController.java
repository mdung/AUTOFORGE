package com.autoforge.modules.search.controller;

import com.autoforge.modules.customer.model.Customer;
import com.autoforge.modules.customer.repository.CustomerRepository;
import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.repository.VehicleRepository;
import com.autoforge.modules.repairorder.model.RepairOrder;
import com.autoforge.modules.repairorder.repository.RepairOrderRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final RepairOrderRepository repairOrderRepository;

    @GetMapping("/global")
    public ResponseEntity<GlobalSearchResult> globalSearch(
            @RequestHeader("X-Tenant-ID") String tenantIdStr,
            @RequestParam String q) {
        UUID tenantId = UUID.fromString(tenantIdStr);
        String query = q.trim().toLowerCase();

        List<Customer> customers = customerRepository.searchCustomers(tenantId, query);
        List<Vehicle> vehicles = vehicleRepository.searchVehicles(tenantId, query);
        
        List<RepairOrder> roList = repairOrderRepository.findAllByTenantId(tenantId).stream()
                .filter(ro -> ro.getRoNumber().toLowerCase().contains(query))
                .collect(Collectors.toList());

        GlobalSearchResult result = new GlobalSearchResult();
        result.setCustomers(customers);
        result.setVehicles(vehicles);
        result.setRepairOrders(roList);

        return ResponseEntity.ok(result);
    }

    @Getter
    @Setter
    public static class GlobalSearchResult {
        private List<Customer> customers;
        private List<Vehicle> vehicles;
        private List<RepairOrder> repairOrders;
    }
}
