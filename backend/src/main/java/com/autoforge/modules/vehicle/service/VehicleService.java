package com.autoforge.modules.vehicle.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<Vehicle> getAllVehicles(org.springframework.data.domain.Pageable pageable) {
        return vehicleRepository.findAllByTenantId(TenantContext.getCurrentTenant(), pageable);
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByOwner(UUID ownerId) {
        return vehicleRepository.findAllByTenantIdAndOwnerId(TenantContext.getCurrentTenant(), ownerId);
    }

    @Transactional(readOnly = true)
    public List<Vehicle> searchVehicles(String query) {
        return vehicleRepository.searchVehicles(TenantContext.getCurrentTenant(), query);
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleById(UUID id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        if (!vehicle.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return vehicle;
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setTenantId(TenantContext.getCurrentTenant());
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(UUID id, Vehicle details) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setLicensePlate(details.getLicensePlate());
        vehicle.setMake(details.getMake());
        vehicle.setModel(details.getModel());
        vehicle.setVariant(details.getVariant());
        vehicle.setYear(details.getYear());
        vehicle.setMileage(details.getMileage());
        vehicle.setEngineType(details.getEngineType());
        vehicle.setFuelType(details.getFuelType());
        vehicle.setTransmission(details.getTransmission());
        vehicle.setColor(details.getColor());
        vehicle.setLastServiceDate(details.getLastServiceDate());
        vehicle.setNextServiceDate(details.getNextServiceDate());
        return vehicleRepository.save(vehicle);
    }
}
