package com.autoforge.modules.appointment.repository;

import com.autoforge.modules.appointment.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findAllByTenantId(UUID tenantId);
    List<Appointment> findAllByTenantIdAndBranchId(UUID tenantId, UUID branchId);
}
