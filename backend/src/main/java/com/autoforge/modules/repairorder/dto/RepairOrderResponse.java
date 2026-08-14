package com.autoforge.modules.repairorder.dto;

import lombok.*;
import java.util.UUID;
import java.time.OffsetDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class RepairOrderResponse {
    private UUID id;
    private String roNumber;
    private UUID customerId;
    private UUID vehicleId;
    private UUID branchId;
    private UUID advisorId;
    private String status;
    private Integer mileage;
    private String priority;
    private OffsetDateTime promisedTime;
    private String notes;
}
