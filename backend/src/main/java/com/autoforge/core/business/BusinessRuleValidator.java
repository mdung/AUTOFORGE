package com.autoforge.core.business;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Slf4j
public class BusinessRuleValidator {

    private final Set<String> validTransitions = new HashSet<>(Arrays.asList(
        "DRAFT->CHECKED_IN",
        "DRAFT->APPROVED",
        "CHECKED_IN->INSPECTION",
        "INSPECTION->WAITING_APPROVAL",
        "WAITING_APPROVAL->APPROVED",
        "WAITING_APPROVAL->CANCELLED",
        "APPROVED->READY_FOR_WORK",
        "READY_FOR_WORK->IN_PROGRESS",
        "IN_PROGRESS->QUALITY_CONTROL",
        "IN_PROGRESS->WAITING_PARTS",
        "WAITING_PARTS->IN_PROGRESS",
        "QUALITY_CONTROL->READY_FOR_DELIVERY",
        "QUALITY_CONTROL->IN_PROGRESS",
        "READY_FOR_DELIVERY->DELIVERED",
        "DELIVERED->CLOSED",
        "DRAFT->CANCELLED",
        "CHECKED_IN->CANCELLED",
        "INSPECTION->CANCELLED",
        "APPROVED->CANCELLED",
        "READY_FOR_WORK->CANCELLED",
        "IN_PROGRESS->CANCELLED",
        "WAITING_PARTS->CANCELLED"
    ));

    public void validateStateTransition(String currentStatus, String nextStatus) {
        if (currentStatus == null || nextStatus == null) return;
        if (currentStatus.equals(nextStatus)) return;
        
        String key = currentStatus + "->" + nextStatus;
        if (!validTransitions.contains(key)) {
            log.warn("Invalid Repair Order state transition: {} to {}", currentStatus, nextStatus);
            throw new IllegalStateException("Hành động không hợp lệ: Không cho phép chuyển trạng thái từ " + currentStatus + " sang " + nextStatus);
        }
    }

    public void enforceQcGating(boolean qcPassed) {
        if (!qcPassed) {
            log.warn("Delivery blocked: vehicle did not pass Quality Control checks.");
            throw new IllegalStateException("Giao xe bị chặn: Phương tiện chưa hoàn thành hoặc chưa đạt bài kiểm duyệt chất lượng QC.");
        }
    }

    public Map<String, Object> calculateNextServiceReminder(int currentOdometer) {
        int nextOdometer = currentOdometer + 5000; // Recommend service every 5,000 km
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, 6); // Or every 6 months
        
        Map<String, Object> reminder = new HashMap<>();
        reminder.put("nextServiceOdometer", nextOdometer);
        reminder.put("nextServiceDate", cal.getTime());
        reminder.put("recommendation", "Đã đến lịch thay nhớt và kiểm tra định kỳ 5,000 km.");
        return reminder;
    }

    public boolean detectRecurringFailure(String vehicleId, String jobCategory, List<Map<String, Object>> historicalJobs) {
        if (historicalJobs == null) return false;

        long now = System.currentTimeMillis();
        long thirtyDaysAgo = now - (30L * 24 * 60 * 60 * 1000);

        for (Map<String, Object> job : historicalJobs) {
            String category = (String) job.get("category");
            Date completedAt = (Date) job.get("completedAt");
            if (category != null && category.equalsIgnoreCase(jobCategory) && completedAt != null) {
                if (completedAt.getTime() >= thirtyDaysAgo) {
                    log.warn("Recurring failure detected for vehicle {} in category {}", vehicleId, jobCategory);
                    return true;
                }
            }
        }
        return false;
    }
}
