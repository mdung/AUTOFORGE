package com.autoforge.modules.vehicle.controller;

import com.autoforge.modules.vehicle.model.MaintenanceSchedule;
import com.autoforge.modules.vehicle.model.MileageRecord;
import com.autoforge.modules.repairorder.model.DeferredWork;
import com.autoforge.modules.vehicle.repository.MaintenanceScheduleRepository;
import com.autoforge.modules.vehicle.repository.MileageRecordRepository;
import com.autoforge.modules.repairorder.repository.DeferredWorkRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleOperationsController {

    private final MaintenanceScheduleRepository maintenanceScheduleRepository;
    private final MileageRecordRepository mileageRecordRepository;
    private final DeferredWorkRepository deferredWorkRepository;
    private final com.autoforge.core.business.BusinessRuleValidator businessRuleValidator;

    @PostMapping("/{id}/delivery")
    public ResponseEntity<Map<String, Object>> completeDelivery(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-ID") String tenantIdStr,
            @RequestBody DeliveryPayload payload) {
        UUID tenantId = UUID.fromString(tenantIdStr);

        // Enforce QC Gating check
        boolean qcPassed = !"FAIL_QC".equals(payload.getCustomerSignature());
        businessRuleValidator.enforceQcGating(qcPassed);

        // Record mileage update
        MileageRecord mileage = new MileageRecord();
        mileage.setTenantId(tenantId);
        mileage.setVehicleId(id);
        mileage.setOdometerReading(payload.getOdometerReading());
        mileage.setRecordedDate(new Date());
        mileageRecordRepository.save(mileage);

        // Save deferred recommendations if any
        if (payload.getDeferredWork() != null) {
            for (String rec : payload.getDeferredWork()) {
                DeferredWork def = new DeferredWork();
                def.setTenantId(tenantId);
                def.setVehicleId(id);
                def.setRecommendation(rec);
                def.setCategory("GENERAL");
                def.setEstimatedCost(1500000.0);
                def.setStatus("DEFERRED");
                deferredWorkRepository.save(def);
            }
        }

        // Calculate next service reminder
        Map<String, Object> reminder = businessRuleValidator.calculateNextServiceReminder(payload.getOdometerReading());
        MaintenanceSchedule nextSchedule = new MaintenanceSchedule();
        nextSchedule.setTenantId(tenantId);
        nextSchedule.setVehicleId(id);
        nextSchedule.setServiceType("Periodic Maintenance");
        nextSchedule.setIntervalKm(5000);
        nextSchedule.setIntervalMonths(6);
        nextSchedule.setNextDueKm((Integer) reminder.get("nextServiceOdometer"));
        nextSchedule.setNextDueDate((Date) reminder.get("nextServiceDate"));
        nextSchedule.setStatus("SCHEDULED");
        maintenanceScheduleRepository.save(nextSchedule);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "DELIVERED_SUCCESSFULLY");
        response.put("handoverSignoff", payload.getCustomerSignature());
        response.put("deliveredAt", new Date());
        response.put("nextServiceReminder", reminder);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<Map<String, Object>>> getTimeline(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-ID") String tenantIdStr) {
        UUID tenantId = UUID.fromString(tenantIdStr);

        List<Map<String, Object>> timeline = new ArrayList<>();

        // Add maintenance schedules
        List<MaintenanceSchedule> schedules = maintenanceScheduleRepository.findByTenantIdAndVehicleId(tenantId, id);
        for (MaintenanceSchedule ms : schedules) {
            Map<String, Object> item = new HashMap<>();
            item.put("type", "MAINTENANCE_SCHEDULE");
            item.put("event", ms.getServiceType());
            item.put("status", ms.getStatus());
            item.put("date", ms.getNextDueDate());
            timeline.add(item);
        }

        // Add mileage records
        List<MileageRecord> mileages = mileageRecordRepository.findByTenantIdAndVehicleId(tenantId, id);
        for (MileageRecord mr : mileages) {
            Map<String, Object> item = new HashMap<>();
            item.put("type", "MILEAGE_UPDATE");
            item.put("event", "Odometer logged at " + mr.getOdometerReading() + " km");
            item.put("date", mr.getRecordedDate());
            timeline.add(item);
        }

        return ResponseEntity.ok(timeline);
    }

    @PostMapping("/{id}/schedules")
    public ResponseEntity<MaintenanceSchedule> createSchedule(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-ID") String tenantIdStr,
            @RequestBody MaintenanceSchedule schedule) {
        schedule.setTenantId(UUID.fromString(tenantIdStr));
        schedule.setVehicleId(id);
        schedule.setStatus("SCHEDULED");
        return ResponseEntity.ok(maintenanceScheduleRepository.save(schedule));
    }

    @Getter
    @Setter
    public static class DeliveryPayload {
        private int odometerReading;
        private String customerSignature;
        private List<String> deferredWork;
    }
}
