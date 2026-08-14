package com.autoforge.modules.future.controller;

import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.service.VehicleService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public/anpr")
@RequiredArgsConstructor
public class AnprGateController {

    private final VehicleService vehicleService;

    @PostMapping("/gate-detect")
    public ResponseEntity<Map<String, Object>> detectVehicleAtGate(@RequestBody AnprPayload payload) {
        String plate = payload.getLicensePlate();
        Map<String, Object> response = new HashMap<>();
        response.put("licensePlate", plate);
        response.put("gateId", payload.getGateId());

        // Scan database for matching vehicle
        List<Vehicle> matchedVehicles = vehicleService.searchVehicles(plate);
        if (matchedVehicles != null && !matchedVehicles.isEmpty()) {
            Vehicle vehicle = matchedVehicles.get(0);
            response.put("matched", true);
            response.put("vehicleId", vehicle.getId());
            response.put("vehicleDesc", vehicle.getMake() + " " + vehicle.getModel());
            response.put("ownerId", vehicle.getOwnerId());
            response.put("alertMessage", String.format(
                "Xe %s %s của KH Nguyễn Văn A vừa vào cổng. Lịch hẹn bảo dưỡng định kỳ lúc 14:00.",
                vehicle.getMake(), vehicle.getModel()
            ));
        } else {
            response.put("matched", false);
            response.put("alertMessage", String.format("Xe lạ (Biển số: %s) vừa đi qua cổng %s.", plate, payload.getGateId()));
        }

        return ResponseEntity.ok(response);
    }

    @Getter
    @Setter
    public static class AnprPayload {
        private String licensePlate;
        private String gateId;
    }
}
