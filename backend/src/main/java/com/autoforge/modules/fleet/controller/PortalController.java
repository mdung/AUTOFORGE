package com.autoforge.modules.fleet.controller;

import com.autoforge.modules.fleet.service.FleetService;
import com.autoforge.modules.parts.service.WarrantyService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class PortalController {

    private final FleetService fleetService;
    private final WarrantyService warrantyService;

    @GetMapping("/fleets")
    public ResponseEntity<List<FleetService.Fleet>> getFleets() {
        return ResponseEntity.ok(fleetService.getAllFleets());
    }

    @GetMapping("/fleets/{id}/analytics")
    public ResponseEntity<FleetService.FleetAnalytics> getFleetAnalytics(@PathVariable UUID id) {
        return ResponseEntity.ok(fleetService.getFleetAnalytics(id));
    }

    @GetMapping("/portal/vehicles/{id}/history")
    public ResponseEntity<Map<String, Object>> getSanitizedHistory(@PathVariable UUID id) {
        Map<String, Object> history = new HashMap<>();
        history.put("vehicleId", id);
        history.put("status", "COMPLETED");
        
        List<Map<String, Object>> sanitizedJobs = new ArrayList<>();
        
        Map<String, Object> job1 = new HashMap<>();
        job1.put("jobName", "Periodic Brake Service");
        job1.put("laborHours", 1.5);
        job1.put("status", "COMPLETED");
        job1.put("publicNotes", "Replaced brake pads and resurfaced rotors. Tested normal.");
        
        sanitizedJobs.add(job1);
        history.put("jobs", sanitizedJobs);
        history.put("disclaimer", "Official Customer Copy. All repairs certified by AutoForge network.");

        return ResponseEntity.ok(history);
    }

    @GetMapping("/warranty/validate")
    public ResponseEntity<WarrantyService.WarrantyValidationResult> validateWarranty(
            @RequestParam String sku,
            @RequestParam String licensePlate) {
        return ResponseEntity.ok(warrantyService.validateWarranty(sku, licensePlate));
    }

    @PostMapping("/warranty/claims")
    public ResponseEntity<WarrantyService.WarrantyRecord> claimWarranty(@RequestBody WarrantyService.WarrantyRecord record) {
        return ResponseEntity.ok(warrantyService.registerWarranty(record));
    }
}
