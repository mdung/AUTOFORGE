package com.autoforge.modules.future.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final List<MaintenancePackage> packages = new ArrayList<>();
    private final Map<UUID, List<CustomerSubscription>> customerSubscriptions = new HashMap<>();

    {
        // Pre-populate standard maintenance subscription packages
        packages.add(new MaintenancePackage(
            "VIP-STANDARD",
            "Gói VIP Chuẩn (1 Năm)",
            1200000.0,
            "Gói tiết kiệm bao gồm: 3 lần thay dầu nhớt động cơ, 1 lần đảo lốp và cân bằng động miễn phí, hỗ trợ cứu hộ 24/7.",
            3, 1
        ));
        packages.add(new MaintenancePackage(
            "VIP-PLATINUM",
            "Gói VIP Bạch Kim (1 Năm)",
            2500000.0,
            "Gói cao cấp bao gồm: 5 lần thay dầu nhớt động cơ, 3 lần đảo lốp, 1 lần cân chỉnh thước lái laser, rửa xe miễn phí cả năm.",
            5, 3
        ));
    }

    public List<MaintenancePackage> getAvailablePackages() {
        return packages;
    }

    public List<CustomerSubscription> getCustomerSubscriptions(UUID customerId) {
        return customerSubscriptions.computeIfAbsent(customerId, k -> new ArrayList<>());
    }

    public CustomerSubscription purchasePackage(UUID customerId, String packageCode) {
        MaintenancePackage pack = packages.stream()
            .filter(p -> p.getCode().equals(packageCode))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Package code not found"));

        CustomerSubscription sub = new CustomerSubscription();
        sub.setId(UUID.randomUUID());
        sub.setCustomerId(customerId);
        sub.setPackageCode(pack.getCode());
        sub.setPackageName(pack.getName());
        sub.setRemainingOilChanges(pack.getOilChangesLimit());
        sub.setRemainingTireRotations(pack.getTireRotationsLimit());
        sub.setStatus("ACTIVE");
        sub.setPurchaseDate(new Date().toString());

        getCustomerSubscriptions(customerId).add(sub);
        return sub;
    }

    public CustomerSubscription redeemBenefit(UUID customerId, UUID subId, String benefitType) {
        List<CustomerSubscription> subs = getCustomerSubscriptions(customerId);
        CustomerSubscription activeSub = subs.stream()
            .filter(s -> s.getId().equals(subId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));

        if ("OIL".equals(benefitType)) {
            if (activeSub.getRemainingOilChanges() <= 0) {
                throw new IllegalStateException("Hết lượt thay dầu nhớt động cơ trong gói!");
            }
            activeSub.setRemainingOilChanges(activeSub.getRemainingOilChanges() - 1);
        } else if ("TIRE".equals(benefitType)) {
            if (activeSub.getRemainingTireRotations() <= 0) {
                throw new IllegalStateException("Hết lượt đảo lốp trong gói!");
            }
            activeSub.setRemainingTireRotations(activeSub.getRemainingTireRotations() - 1);
        }

        return activeSub;
    }

    @Getter
    @RequiredArgsConstructor
    public static class MaintenancePackage {
        private final String code;
        private final String name;
        private final double price;
        private final String description;
        private final int oilChangesLimit;
        private final int tireRotationsLimit;
    }

    @Getter
    @Setter
    public static class CustomerSubscription {
        private UUID id;
        private UUID customerId;
        private String packageCode;
        private String packageName;
        private int remainingOilChanges;
        private int remainingTireRotations;
        private String status;
        private String purchaseDate;
    }
}
