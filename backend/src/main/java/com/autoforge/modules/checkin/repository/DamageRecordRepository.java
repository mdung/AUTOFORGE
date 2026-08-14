package com.autoforge.modules.checkin.repository;

import com.autoforge.modules.checkin.model.DamageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DamageRecordRepository extends JpaRepository<DamageRecord, UUID> {
    List<DamageRecord> findAllByTenantIdAndCheckInId(UUID tenantId, UUID checkInId);
}
