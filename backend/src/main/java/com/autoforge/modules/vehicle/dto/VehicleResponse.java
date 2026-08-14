package com.autoforge.modules.vehicle.dto;

import lombok.*;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class VehicleResponse {
    private UUID id;
    private UUID ownerId;
    private String licensePlate;
    private String vin;
    private String make;
    private String model;
    private String variant;
    private Integer year;
    private Integer mileage;
    private String engineType;
    private String fuelType;
    private String transmission;
    private String color;
}
