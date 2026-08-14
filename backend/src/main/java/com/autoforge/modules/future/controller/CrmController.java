package com.autoforge.modules.future.controller;

import com.autoforge.modules.future.service.NotificationAutomationService;
import com.autoforge.modules.future.service.SubscriptionService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/crm")
@RequiredArgsConstructor
public class CrmController {

    private final NotificationAutomationService notificationAutomationService;
    private final SubscriptionService subscriptionService;

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationAutomationService.CrmNotification>> getNotifications() {
        return ResponseEntity.ok(notificationAutomationService.getAllNotifications());
    }

    @PostMapping("/notifications/trigger")
    public ResponseEntity<String> triggerNotification(@RequestBody NotificationPayload payload) {
        notificationAutomationService.triggerNotification(
            payload.getCustomerName(),
            payload.getPhone(),
            payload.getLicensePlate(),
            payload.getType()
        );
        return ResponseEntity.ok("Notification triggered successfully");
    }

    @GetMapping("/subscriptions/packages")
    public ResponseEntity<List<SubscriptionService.MaintenancePackage>> getPackages() {
        return ResponseEntity.ok(subscriptionService.getAvailablePackages());
    }

    @GetMapping("/subscriptions/customer/{customerId}")
    public ResponseEntity<List<SubscriptionService.CustomerSubscription>> getCustomerSubscriptions(@PathVariable UUID customerId) {
        return ResponseEntity.ok(subscriptionService.getCustomerSubscriptions(customerId));
    }

    @PostMapping("/subscriptions/purchase")
    public ResponseEntity<SubscriptionService.CustomerSubscription> purchasePackage(@RequestBody PurchasePayload payload) {
        return ResponseEntity.ok(subscriptionService.purchasePackage(payload.getCustomerId(), payload.getPackageCode()));
    }

    @PostMapping("/subscriptions/redeem")
    public ResponseEntity<SubscriptionService.CustomerSubscription> redeemBenefit(@RequestBody RedeemPayload payload) {
        return ResponseEntity.ok(subscriptionService.redeemBenefit(
            payload.getCustomerId(),
            payload.getSubscriptionId(),
            payload.getBenefitType()
        ));
    }

    @Getter
    @Setter
    public static class NotificationPayload {
        private String customerName;
        private String phone;
        private String licensePlate;
        private String type;
    }

    @Getter
    @Setter
    public static class PurchasePayload {
        private UUID customerId;
        private String packageCode;
    }

    @Getter
    @Setter
    public static class RedeemPayload {
        private UUID customerId;
        private UUID subscriptionId;
        private String benefitType; // OIL, TIRE
    }
}
