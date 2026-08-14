package com.autoforge.modules.checkin.repository;

import com.autoforge.modules.checkin.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {
    List<CheckIn> findAllByTenantId(UUID tenantId);
}
