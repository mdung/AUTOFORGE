package com.autoforge.modules.future.controller;

import com.autoforge.modules.future.service.AiCopilotService;
import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class AiCopilotController {

    private final VehicleService vehicleService;
    private final AiCopilotService aiCopilotService;

    @GetMapping("/{id}/ai-summary")
    public ResponseEntity<Map<String, String>> getAiVehicleSummary(@PathVariable UUID id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        
        // Build a history text string from vehicle info
        String historyText = String.format(
            "License Plate: %s, Current Mileage: %d km, Transmission: %s, Engine: %s. Previous issues: Brake pads warning, P0301 cylinder 1 misfire.",
            vehicle.getLicensePlate(),
            vehicle.getMileage(),
            vehicle.getTransmission(),
            vehicle.getEngineType()
        );

        String summary = aiCopilotService.analyzeVehicleHistory(vehicle.getMake(), vehicle.getModel(), historyText);
        
        Map<String, String> response = new HashMap<>();
        response.put("analysis", summary);
        return ResponseEntity.ok(response);
    }
}
