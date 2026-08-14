package com.autoforge.modules.vehicle.service;

import com.autoforge.modules.vehicle.model.Vehicle;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
public class NhtsaVehicleDataProvider implements VehicleDataProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Vehicle decodeVin(String vin) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVin(vin);
        vehicle.setLicensePlate("");
        vehicle.setMileage(0);

        try {
            String url = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/" + vin + "?format=json";
            NhtsaResponse response = restTemplate.getForObject(url, NhtsaResponse.class);

            if (response != null && response.getResults() != null) {
                for (NhtsaResult result : response.getResults()) {
                    String var = result.getVariable();
                    String val = result.getValue();

                    if (val == null || val.isBlank() || "null".equalsIgnoreCase(val)) {
                        continue;
                    }

                    switch (var) {
                        case "Make":
                            vehicle.setMake(val);
                            break;
                        case "Model":
                            vehicle.setModel(val);
                            break;
                        case "Model Year":
                            try {
                                vehicle.setYear(Integer.parseInt(val));
                            } catch (NumberFormatException e) {
                                log.warn("Failed to parse model year: {}", val);
                            }
                            break;
                        case "Fuel Type - Primary":
                            vehicle.setFuelType(val);
                            if (val.toLowerCase().contains("electric")) {
                                vehicle.setEngineType("EV");
                            } else if (val.toLowerCase().contains("hybrid")) {
                                vehicle.setEngineType("HYBRID");
                            } else {
                                vehicle.setEngineType("ICE");
                            }
                            break;
                        case "Transmission Style":
                            vehicle.setTransmission(val);
                            break;
                        case "Engine Model":
                        case "Engine Cylinders":
                            if (vehicle.getVariant() == null) {
                                vehicle.setVariant(val);
                            } else {
                                vehicle.setVariant(vehicle.getVariant() + " " + val);
                            }
                            break;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error calling NHTSA VPIC API for VIN: {}. Error: {}", vin, e.getMessage());
            // Fail silently and return empty vehicle object with just the VIN
        }

        // Apply clean fallbacks for required non-null DB fields if the API did not populate them
        if (vehicle.getMake() == null) vehicle.setMake("Unknown");
        if (vehicle.getModel() == null) vehicle.setModel("Unknown");
        if (vehicle.getEngineType() == null) vehicle.setEngineType("ICE");

        return vehicle;
    }

    @Getter
    @Setter
    public static class NhtsaResponse {
        private List<NhtsaResult> Results;
    }

    @Getter
    @Setter
    public static class NhtsaResult {
        private String Variable;
        private String Value;
    }
}
