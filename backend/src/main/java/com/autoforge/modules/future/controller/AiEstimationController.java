package com.autoforge.modules.future.controller;

import com.autoforge.modules.future.service.AiCopilotService;
import com.autoforge.modules.future.service.PredictiveMaintenanceService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class AiEstimationController {

    private final PredictiveMaintenanceService predictiveMaintenanceService;
    private final AiCopilotService aiCopilotService;

    @GetMapping("/vehicles/{id}/predictive-maintenance")
    public ResponseEntity<List<PredictiveMaintenanceService.MaintenancePrediction>> getPredictiveMaintenance(@PathVariable UUID id) {
        return ResponseEntity.ok(predictiveMaintenanceService.getPredictions(id));
    }

    @PostMapping("/repairorders/jobs/estimate-damage")
    public ResponseEntity<Map<String, String>> estimateDamage(@RequestBody DamagePayload payload) {
        String result = aiCopilotService.estimateDamageLabor(payload.getBase64Image(), payload.getImageName());
        Map<String, String> response = new HashMap<>();
        response.put("estimation", result);
        return ResponseEntity.ok(response);
    }

    @Getter
    @Setter
    public static class DamagePayload {
        private String base64Image;
        private String imageName;
    }
}
