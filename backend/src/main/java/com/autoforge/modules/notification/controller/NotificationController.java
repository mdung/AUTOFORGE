package com.autoforge.modules.notification.controller;

import com.autoforge.modules.notification.model.Notification;
import com.autoforge.modules.notification.repository.NotificationRepository;
import com.autoforge.modules.notification.service.CommunicationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final CommunicationService communicationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestHeader("X-Tenant-ID") String tenantIdStr) {
        UUID tenantId = UUID.fromString(tenantIdStr);
        return ResponseEntity.ok(notificationRepository.findByTenantId(tenantId));
    }

    @PostMapping("/send-email")
    public ResponseEntity<Notification> sendEmail(
            @RequestHeader("X-Tenant-ID") String tenantIdStr,
            @RequestBody EmailPayload payload) {
        UUID tenantId = UUID.fromString(tenantIdStr);
        return ResponseEntity.ok(communicationService.sendEmail(tenantId, payload.getRecipient(), payload.getTitle(), payload.getBody()));
    }

    @PostMapping("/send-sms")
    public ResponseEntity<Notification> sendSms(
            @RequestHeader("X-Tenant-ID") String tenantIdStr,
            @RequestBody SmsPayload payload) {
        UUID tenantId = UUID.fromString(tenantIdStr);
        return ResponseEntity.ok(communicationService.sendSms(tenantId, payload.getRecipient(), payload.getMessage()));
    }

    @Getter
    @Setter
    public static class EmailPayload {
        private String recipient;
        private String title;
        private String body;
    }

    @Getter
    @Setter
    public static class SmsPayload {
        private String recipient;
        private String message;
    }
}
