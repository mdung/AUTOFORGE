package com.autoforge.modules.notification.service;

import com.autoforge.modules.notification.model.Notification;
import com.autoforge.modules.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunicationService {

    private final NotificationRepository notificationRepository;

    public Notification sendEmail(UUID tenantId, String recipient, String title, String body) {
        log.info("Sending Email to {}: {} - {}", recipient, title, body);
        return saveNotification(tenantId, recipient, title, body, "EMAIL", "SYSTEM");
    }

    public Notification sendSms(UUID tenantId, String recipient, String message) {
        log.info("Sending SMS Brandname to {}: {}", recipient, message);
        return saveNotification(tenantId, recipient, "SMS Brandname", message, "SMS", "SYSTEM");
    }

    public Notification sendPushNotification(UUID tenantId, String recipientToken, String title, String body) {
        log.info("Sending Push to device {}: {} - {}", recipientToken, title, body);
        return saveNotification(tenantId, recipientToken, title, body, "PUSH", "SYSTEM");
    }

    private Notification saveNotification(UUID tenantId, String recipient, String title, String message, String channel, String type) {
        Notification notif = new Notification();
        notif.setTenantId(tenantId);
        notif.setRecipient(recipient);
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setChannel(channel);
        notif.setType(type);
        notif.setStatus("SENT");
        return notificationRepository.save(notif);
    }
}
