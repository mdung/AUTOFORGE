package com.autoforge.modules.report.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    @GetMapping("/summary")
    public ResponseEntity<ReportSummary> getSummaryReport(@RequestHeader("X-Tenant-ID") String tenantIdStr) {
        // Return analytical summary metrics for business reporting
        ReportSummary summary = new ReportSummary();
        summary.setTotalRevenue(352500000.0);
        summary.setAverageTicketValue(4500000.0);
        summary.setActiveJobsCount(18);
        summary.setCompletedJobsCount(145);
        summary.setVatCollected(32050000.0);

        List<MechanicPerformance> performances = new ArrayList<>();
        performances.add(new MechanicPerformance("Nguyen Van Son", 92.5, 42.0));
        performances.add(new MechanicPerformance("Tran Minh Hoang", 88.0, 38.5));
        performances.add(new MechanicPerformance("Le Tuan Anh", 95.0, 48.0));
        summary.setMechanicEfficiencies(performances);

        return ResponseEntity.ok(summary);
    }

    @Getter
    @Setter
    public static class ReportSummary {
        private double totalRevenue;
        private double averageTicketValue;
        private int activeJobsCount;
        private int completedJobsCount;
        private double vatCollected;
        private List<MechanicPerformance> mechanicEfficiencies;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class MechanicPerformance {
        private String mechanicName;
        private double efficiencyPercentage;
        private double completedHours;
    }
}
