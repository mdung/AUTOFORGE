package com.autoforge.modules.vehicle.controller;

import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final com.autoforge.modules.vehicle.service.VehicleDataProvider vehicleDataProvider;

    @GetMapping("/decode/{vin}")
    public ResponseEntity<Vehicle> decodeVin(@PathVariable String vin) {
        return ResponseEntity.ok(vehicleDataProvider.decodeVin(vin));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<Vehicle>> getAllVehiclesPaginated(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(vehicleService.getAllVehicles(pageable));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Vehicle>> getVehiclesByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByOwner(ownerId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(@RequestParam String query) {
        return ResponseEntity.ok(vehicleService.searchVehicles(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable UUID id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN')")
    public ResponseEntity<Vehicle> createVehicle(@jakarta.validation.Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicle));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable UUID id, @jakarta.validation.Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicle));
    }
}
