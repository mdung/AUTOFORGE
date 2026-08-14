package com.autoforge.modules.appointment.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.appointment.model.Appointment;
import com.autoforge.modules.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByBranch(UUID branchId) {
        return appointmentRepository.findAllByTenantIdAndBranchId(TenantContext.getCurrentTenant(), branchId);
    }

    @Transactional(readOnly = true)
    public Appointment getAppointmentById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        if (!appointment.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return appointment;
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        appointment.setTenantId(TenantContext.getCurrentTenant());
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateAppointmentStatus(UUID id, String status) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
