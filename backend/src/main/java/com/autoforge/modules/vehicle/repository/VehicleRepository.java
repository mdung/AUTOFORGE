package com.autoforge.modules.vehicle.repository;

import com.autoforge.modules.vehicle.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findAllByTenantId(UUID tenantId);
    org.springframework.data.domain.Page<Vehicle> findAllByTenantId(UUID tenantId, org.springframework.data.domain.Pageable pageable);
    List<Vehicle> findAllByTenantIdAndOwnerId(UUID tenantId, UUID ownerId);
    
    Optional<Vehicle> findByTenantIdAndVin(UUID tenantId, String vin);
    Optional<Vehicle> findByTenantIdAndLicensePlate(UUID tenantId, String licensePlate);

    @Query("SELECT v FROM Vehicle v WHERE v.tenantId = :tenantId AND (LOWER(v.licensePlate) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.vin) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.make) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Vehicle> searchVehicles(UUID tenantId, String query);
}
