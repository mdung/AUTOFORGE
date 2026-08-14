package com.autoforge;

import com.autoforge.core.business.BusinessRuleValidator;
import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.customer.model.Customer;
import com.autoforge.modules.customer.repository.CustomerRepository;
import com.autoforge.modules.tenant.model.Tenant;
import com.autoforge.modules.tenant.repository.TenantRepository;
import com.autoforge.modules.vehicle.controller.VehicleOperationsController;
import com.autoforge.modules.vehicle.model.MaintenanceSchedule;
import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.repository.MaintenanceScheduleRepository;
import com.autoforge.modules.vehicle.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AutoForgeWorkflowIntegrationTest {

    @Autowired
    private BusinessRuleValidator businessRuleValidator;

    @Autowired
    private VehicleOperationsController vehicleOperationsController;

    @Autowired
    private MaintenanceScheduleRepository maintenanceScheduleRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private UUID tenantId;
    private UUID vehicleId;

    @BeforeEach
    void setUp() {
        // Create and save tenant to satisfy database FK constraints
        Tenant tenant = new Tenant();
        tenant.setName("Integration Test Tenant");
        tenant.setPlan("FREE");
        tenant = tenantRepository.save(tenant);
        tenantId = tenant.getId();
        
        TenantContext.setCurrentTenant(tenantId);

        // Create and save customer to satisfy vehicle owner_id FK constraints
        Customer customer = new Customer();
        customer.setTenantId(tenantId);
        customer.setName("Test Customer");
        customer.setPhone("0123456789");
        customer.setType("INDIVIDUAL");
        customer = customerRepository.save(customer);

        // Create and save vehicle to satisfy database FK constraints
        Vehicle vehicle = new Vehicle();
        vehicle.setTenantId(tenantId);
        vehicle.setOwnerId(customer.getId());
        vehicle.setLicensePlate("30A-TEST");
        vehicle.setVin("VIN1234567890TEST");
        vehicle.setMake("Toyota");
        vehicle.setModel("Corolla");
        vehicle.setMileage(100000);
        vehicle = vehicleRepository.save(vehicle);
        vehicleId = vehicle.getId();
    }

    @Test
    void testRepairOrderStateTransitions() {
        // Valid transitions
        assertDoesNotThrow(() -> businessRuleValidator.validateStateTransition("DRAFT", "APPROVED"));
        assertDoesNotThrow(() -> businessRuleValidator.validateStateTransition("IN_PROGRESS", "QUALITY_CONTROL"));

        // Invalid transition
        assertThrows(IllegalStateException.class, () -> 
            businessRuleValidator.validateStateTransition("DRAFT", "DELIVERED")
        );
    }

    @Test
    void testQcGatingAndDeliveryHandoverFlow() {
        // Prepare payload for delivery
        VehicleOperationsController.DeliveryPayload payload = new VehicleOperationsController.DeliveryPayload();
        payload.setOdometerReading(120000);
        payload.setCustomerSignature("Nguyen Van A");
        payload.setDeferredWork(List.of("Brake pads worn"));

        // Verify successful delivery with signature and check next service schedule creation
        ResponseEntity<Map<String, Object>> response = vehicleOperationsController.completeDelivery(
                vehicleId,
                tenantId.toString(),
                payload
        );

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("DELIVERED_SUCCESSFULLY", response.getBody().get("status"));
        assertNotNull(response.getBody().get("nextServiceReminder"));

        // Verify next service schedule is saved in database
        List<MaintenanceSchedule> schedules = maintenanceScheduleRepository.findByTenantIdAndVehicleId(tenantId, vehicleId);
        assertFalse(schedules.isEmpty());
        assertEquals(125000, schedules.get(0).getNextDueKm());
    }

    @Test
    void testDeliveryBlockedWhenQcFails() {
        VehicleOperationsController.DeliveryPayload payload = new VehicleOperationsController.DeliveryPayload();
        payload.setOdometerReading(120000);
        payload.setCustomerSignature("FAIL_QC"); // Triggers QC fail trigger

        assertThrows(IllegalStateException.class, () -> 
            vehicleOperationsController.completeDelivery(vehicleId, tenantId.toString(), payload)
        );
    }
}
