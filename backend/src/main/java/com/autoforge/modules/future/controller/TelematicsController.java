package com.autoforge.modules.future.controller;

import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.service.VehicleService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class TelematicsController {

    private final VehicleService vehicleService;

    @PostMapping("/{id}/obd-sync")
    public ResponseEntity<ObdResponse> syncObdData(@PathVariable UUID id, @RequestBody ObdPayload payload) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        
        // Update vehicle details based on telematics stream
        if (payload.getMileage() > 0) {
            vehicle.setMileage(payload.getMileage());
            vehicleService.updateVehicle(id, vehicle);
        }

        List<String> activeAlerts = new ArrayList<>();
        if (payload.getBatteryVoltage() < 12.0) {
            activeAlerts.add("Low Battery Voltage detected (" + payload.getBatteryVoltage() + "V)");
        }
        if (payload.getCoolantTemperature() > 105.0) {
            activeAlerts.add("High Engine Temperature warning (" + payload.getCoolantTemperature() + "°C)");
        }
        if (payload.getDtcCodes() != null && !payload.getDtcCodes().isEmpty()) {
            for (String code : payload.getDtcCodes()) {
                activeAlerts.add("Active Fault Code: " + code + " (" + getDtcDescription(code) + ")");
            }
        }

        ObdResponse response = new ObdResponse();
        response.setVehicleId(id);
        response.setLicensePlate(vehicle.getLicensePlate());
        response.setUpdatedMileage(vehicle.getMileage());
        response.setAlerts(activeAlerts);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/telemetry")
    public ResponseEntity<TelemetryPoint> streamTelemetry(@PathVariable UUID id, @RequestBody TelemetryPoint point) {
        point.setTimestamp(System.currentTimeMillis());
        return ResponseEntity.ok(point);
    }

    private String getDtcDescription(String code) {
        return switch (code) {
            case "P0301" -> "Cylinder 1 Misfire Detected";
            case "P0420" -> "Catalyst System Efficiency Below Threshold";
            case "P0171" -> "System Too Lean (Bank 1)";
            default -> "Generic Powertrain Fault";
        };
    }

    @Getter
    @Setter
    public static class ObdPayload {
        private int mileage;
        private List<String> dtcCodes;
        private double batteryVoltage;
        private double coolantTemperature;
    }

    @Getter
    @Setter
    public static class ObdResponse {
        private UUID vehicleId;
        private String licensePlate;
        private int updatedMileage;
        private List<String> alerts;
    }

    @Getter
    @Setter
    public static class TelemetryPoint {
        private int rpm;
        private int speed;
        private double engineLoad;
        private long timestamp;
    }
}
