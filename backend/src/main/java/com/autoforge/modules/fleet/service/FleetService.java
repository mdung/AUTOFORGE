package com.autoforge.modules.fleet.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FleetService {

    private final List<Fleet> fleets = Collections.synchronizedList(new ArrayList<>());
    private final List<FleetVehicle> fleetVehicles = Collections.synchronizedList(new ArrayList<>());

    {
        // Setup initial demo fleet
        UUID fleetId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        fleets.add(new Fleet(
            fleetId,
            "Công ty Cổ phần Vận tải Mai Linh",
            "Công ty Mai Linh",
            "02438222666",
            "Hà Nội"
        ));

        // Add demo fleet vehicles
        fleetVehicles.add(new FleetVehicle(fleetId, UUID.randomUUID(), "30A-12345", 15, 12500000.0));
        fleetVehicles.add(new FleetVehicle(fleetId, UUID.randomUUID(), "29A-67890", 8, 8900000.0));
    }

    public List<Fleet> getAllFleets() {
        return fleets;
    }

    public Fleet createFleet(Fleet fleet) {
        fleet.setId(UUID.randomUUID());
        fleets.add(fleet);
        return fleet;
    }

    public FleetAnalytics getFleetAnalytics(UUID fleetId) {
        List<FleetVehicle> members = fleetVehicles.stream()
            .filter(v -> v.getFleetId().equals(fleetId))
            .toList();

        int totalDowntime = 0;
        double totalSpend = 0;

        for (FleetVehicle v : members) {
            totalDowntime += v.getDowntimeDays();
            totalSpend += v.getSpendAmount();
        }

        double avgTco = members.isEmpty() ? 0 : totalSpend / members.size();

        FleetAnalytics analytics = new FleetAnalytics();
        analytics.setFleetId(fleetId);
        analytics.setVehicleCount(members.size());
        analytics.setTotalDowntimeDays(totalDowntime);
        analytics.setTotalSpendAmount(totalSpend);
        analytics.setAverageTcoPerVehicle(avgTco);

        return analytics;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Fleet {
        private UUID id;
        private String companyName;
        private String description;
        private String contactPhone;
        private String address;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class FleetVehicle {
        private UUID fleetId;
        private UUID vehicleId;
        private String licensePlate;
        private int downtimeDays;
        private double spendAmount;
    }

    @Getter
    @Setter
    public static class FleetAnalytics {
        private UUID fleetId;
        private int vehicleCount;
        private int totalDowntimeDays;
        private double totalSpendAmount;
        private double averageTcoPerVehicle;
    }
}
