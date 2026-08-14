package com.autoforge.modules.parts.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.parts.model.Part;
import com.autoforge.modules.parts.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PartService {

    private final PartRepository partRepository;
    private final com.autoforge.modules.parts.repository.StockMovementRepository stockMovementRepository;

    @Transactional(readOnly = true)
    public List<Part> getAllParts() {
        return partRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<Part> getAllParts(org.springframework.data.domain.Pageable pageable) {
        return partRepository.findAllByTenantId(TenantContext.getCurrentTenant(), pageable);
    }

    @Transactional(readOnly = true)
    public Part getPartById(UUID id) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Part not found"));
        if (!part.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied");
        }
        return part;
    }

    @Transactional
    public Part createPart(Part part) {
        part.setTenantId(TenantContext.getCurrentTenant());
        return partRepository.save(part);
    }

    @Transactional
    public Part updateStock(UUID id, Integer quantityChange) {
        Part part = getPartById(id);
        part.setStockQty(part.getStockQty() + quantityChange);
        
        com.autoforge.modules.parts.model.StockMovement movement = new com.autoforge.modules.parts.model.StockMovement();
        movement.setTenantId(TenantContext.getCurrentTenant());
        movement.setPartId(id);
        movement.setMovementType(quantityChange >= 0 ? "RECEIPT" : "CONSUMPTION");
        movement.setQuantity(Math.abs(quantityChange));
        movement.setUnitCost(part.getCost());
        stockMovementRepository.save(movement);

        return partRepository.save(part);
    }

    @Transactional
    public Part reserveParts(UUID id, Integer quantity) {
        Part part = getPartById(id);
        part.setReservedQty(part.getReservedQty() + quantity);
        
        com.autoforge.modules.parts.model.StockMovement movement = new com.autoforge.modules.parts.model.StockMovement();
        movement.setTenantId(TenantContext.getCurrentTenant());
        movement.setPartId(id);
        movement.setMovementType("RESERVATION_ADD");
        movement.setQuantity(quantity);
        movement.setUnitCost(part.getCost());
        stockMovementRepository.save(movement);
        
        return partRepository.save(part);
    }

    @Transactional
    public Part releaseReservedParts(UUID id, Integer quantity, boolean isConsumed) {
        Part part = getPartById(id);
        part.setReservedQty(Math.max(0, part.getReservedQty() - quantity));
        
        com.autoforge.modules.parts.model.StockMovement movement = new com.autoforge.modules.parts.model.StockMovement();
        movement.setTenantId(TenantContext.getCurrentTenant());
        movement.setPartId(id);
        movement.setUnitCost(part.getCost());
        movement.setQuantity(quantity);

        if (isConsumed) {
            part.setStockQty(Math.max(0, part.getStockQty() - quantity));
            movement.setMovementType("CONSUMPTION");
        } else {
            movement.setMovementType("RESERVATION_REMOVE");
        }
        stockMovementRepository.save(movement);
        return partRepository.save(part);
    }
}
