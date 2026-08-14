package com.autoforge.modules.future.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationAutomationService {

    private final List<CrmNotification> notificationsList = Collections.synchronizedList(new ArrayList<>());

    public List<CrmNotification> getAllNotifications() {
        return notificationsList;
    }

    public void triggerNotification(String customerName, String phone, String plate, String type) {
        String message = switch (type) {
            case "CHECKIN" -> String.format(
                "[Zalo ZNS] Kính gửi KH %s, xe %s đã được tiếp nhận vào xưởng AutoForge. Cố vấn dịch vụ đang tiến hành kiểm tra xe. Xem tiến trình tại: https://autoforge.vn/track/%s",
                customerName, plate, plate
            );
            case "DVI" -> String.format(
                "[Zalo ZNS] Kính gửi KH %s, báo cáo kiểm tra (DVI) của xe %s đã sẵn sàng. Vui lòng bấm vào link để duyệt báo giá và hình ảnh trực tuyến: https://autoforge.vn/consent/%s",
                customerName, plate, plate
            );
            case "READY" -> String.format(
                "[Zalo ZNS] Kính gửi KH %s, xe %s đã hoàn thành sửa chữa và qua bước kiểm tra chất lượng (QC). Xe đã sẵn sàng bàn giao. Xin cảm ơn quý khách!",
                customerName, plate
            );
            default -> "[SMS Brandname] Kính chào quý khách hàng!";
        };

        CrmNotification notif = new CrmNotification();
        notif.setId(UUID.randomUUID());
        notif.setCustomerName(customerName);
        notif.setPhone(phone);
        notif.setLicensePlate(plate);
        notif.setType(type);
        notif.setMessage(message);
        notif.setTimestamp(new Date().toString());
        notif.setStatus("SENT");

        notificationsList.add(0, notif); // newest first
    }

    @Getter
    @Setter
    public static class CrmNotification {
        private UUID id;
        private String customerName;
        private String phone;
        private String licensePlate;
        private String type; // CHECKIN, DVI, READY
        private String message;
        private String timestamp;
        private String status;
    }
}
