package com.autoforge.modules.vehicle.service;

import com.autoforge.modules.vehicle.model.Vehicle;

public interface VehicleDataProvider {
    Vehicle decodeVin(String vin);
}
