package com.autoforge.modules.appointment.controller;

import com.autoforge.modules.appointment.model.Appointment;
import com.autoforge.modules.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByBranch(@PathVariable UUID branchId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByBranch(branchId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_CUSTOMER_SUPPORT', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<Appointment> createAppointment(@jakarta.validation.Valid @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_BRANCH_MANAGER')")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }
}
