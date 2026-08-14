package com.autoforge.modules.checkin.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.checkin.model.CheckIn;
import com.autoforge.modules.checkin.model.DamageRecord;
import com.autoforge.modules.checkin.repository.CheckInRepository;
import com.autoforge.modules.checkin.repository.DamageRecordRepository;
import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final DamageRecordRepository damageRecordRepository;
    private final VehicleService vehicleService;

    @Transactional(readOnly = true)
    public List<CheckIn> getAllCheckIns() {
        return checkInRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public CheckIn getCheckInById(UUID id) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("CheckIn not found"));
        if (!checkIn.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return checkIn;
    }

    @Transactional(readOnly = true)
    public List<DamageRecord> getDamageRecords(UUID checkInId) {
        return damageRecordRepository.findAllByTenantIdAndCheckInId(TenantContext.getCurrentTenant(), checkInId);
    }

    @Transactional
    public CheckIn createCheckIn(CheckIn checkIn, List<DamageRecord> damageRecords) {
        UUID tenantId = TenantContext.getCurrentTenant();
        checkIn.setTenantId(tenantId);
        checkIn = checkInRepository.save(checkIn);

        // Update Vehicle Mileage
        Vehicle vehicle = vehicleService.getVehicleById(checkIn.getVehicleId());
        vehicle.setMileage(checkIn.getMileage());
        vehicleService.updateVehicle(vehicle.getId(), vehicle);

        // Save damage records
        if (damageRecords != null) {
            for (DamageRecord dr : damageRecords) {
                dr.setTenantId(tenantId);
                dr.setCheckInId(checkIn.getId());
                damageRecordRepository.save(dr);
            }
        }

        return checkIn;
    }
}
