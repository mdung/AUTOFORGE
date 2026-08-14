package com.autoforge.modules.vehicle.repository;

import com.autoforge.modules.vehicle.model.MileageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MileageRecordRepository extends JpaRepository<MileageRecord, UUID> {
    List<MileageRecord> findByTenantId(UUID tenantId);
    List<MileageRecord> findByTenantIdAndVehicleId(UUID tenantId, UUID vehicleId);
}
