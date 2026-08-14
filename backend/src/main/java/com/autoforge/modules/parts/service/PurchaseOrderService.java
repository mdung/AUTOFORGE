package com.autoforge.modules.parts.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.audit.event.DomainEvent;
import com.autoforge.modules.audit.event.DomainEventPublisher;
import com.autoforge.modules.parts.model.PurchaseOrder;
import com.autoforge.modules.parts.model.PurchaseOrder.PurchaseOrderStatus;
import com.autoforge.modules.parts.model.PurchaseOrderItem;
import com.autoforge.modules.parts.model.StockMovement;
import com.autoforge.modules.parts.repository.PurchaseOrderItemRepository;
import com.autoforge.modules.parts.repository.PurchaseOrderRepository;
import com.autoforge.modules.parts.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final PartService partService;
    private final StockMovementRepository stockMovementRepository;
    private final DomainEventPublisher domainEventPublisher;

    @Transactional(readOnly = true)
    public List<PurchaseOrder> getAllForTenant() {
        return purchaseOrderRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public PurchaseOrder getById(UUID id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found"));
        if (!po.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access denied");
        }
        return po;
    }

    @Transactional
    public PurchaseOrder create(PurchaseOrder purchaseOrder) {
        purchaseOrder.setTenantId(TenantContext.getCurrentTenant());
        purchaseOrder.setStatus(PurchaseOrderStatus.DRAFT);
        PurchaseOrder saved = purchaseOrderRepository.save(purchaseOrder);

        domainEventPublisher.publish(new DomainEvent(
                TenantContext.getCurrentTenant(),
                getCurrentActor(),
                "PURCHASE_ORDER_CREATED",
                "PurchaseOrder",
                saved.getId(),
                null,
                Map.of("poNumber", saved.getPoNumber(), "supplierId", saved.getSupplierId().toString())
        ));

        return saved;
    }

    @Transactional
    public PurchaseOrder updateStatus(UUID id, PurchaseOrderStatus newStatus) {
        PurchaseOrder po = getById(id);
        PurchaseOrderStatus oldStatus = po.getStatus();
        po.setStatus(newStatus);
        PurchaseOrder saved = purchaseOrderRepository.save(po);

        domainEventPublisher.publish(new DomainEvent(
                TenantContext.getCurrentTenant(),
                getCurrentActor(),
                "PURCHASE_ORDER_STATUS_UPDATED",
                "PurchaseOrder",
                saved.getId(),
                Map.of("status", oldStatus.name()),
                Map.of("status", newStatus.name())
        ));

        return saved;
    }

    @Transactional
    public PurchaseOrder receiveGoods(UUID id) {
        PurchaseOrder po = getById(id);
        List<PurchaseOrderItem> items = purchaseOrderItemRepository
                .findAllByPurchaseOrderIdAndTenantId(id, TenantContext.getCurrentTenant());

        boolean allFullyReceived = true;

        for (PurchaseOrderItem item : items) {
            int remaining = item.getQuantity() - item.getReceivedQuantity();
            if (remaining > 0) {
                item.setReceivedQuantity(item.getQuantity());
                purchaseOrderItemRepository.save(item);

                // Update part stock
                partService.updateStock(item.getPartId(), remaining);

                // Create stock movement referencing this PO
                StockMovement movement = new StockMovement();
                movement.setTenantId(TenantContext.getCurrentTenant());
                movement.setPartId(item.getPartId());
                movement.setMovementType("RECEIPT");
                movement.setQuantity(remaining);
                movement.setUnitCost(item.getUnitCost());
                movement.setReferenceId(po.getId());
                movement.setNotes("PO Receipt: " + po.getPoNumber());
                stockMovementRepository.save(movement);
            }
            if (item.getReceivedQuantity() < item.getQuantity()) {
                allFullyReceived = false;
            }
        }

        po.setStatus(allFullyReceived ? PurchaseOrderStatus.RECEIVED : PurchaseOrderStatus.PARTIALLY_RECEIVED);
        PurchaseOrder saved = purchaseOrderRepository.save(po);

        domainEventPublisher.publish(new DomainEvent(
                TenantContext.getCurrentTenant(),
                getCurrentActor(),
                "PURCHASE_ORDER_GOODS_RECEIVED",
                "PurchaseOrder",
                saved.getId(),
                null,
                Map.of("status", saved.getStatus().name(), "itemCount", items.size())
        ));

        return saved;
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderItem> getItems(UUID purchaseOrderId) {
        getById(purchaseOrderId); // validates access
        return purchaseOrderItemRepository.findAllByPurchaseOrderIdAndTenantId(
                purchaseOrderId, TenantContext.getCurrentTenant());
    }

    @Transactional
    public PurchaseOrderItem addItem(UUID purchaseOrderId, PurchaseOrderItem item) {
        getById(purchaseOrderId); // validates access
        item.setTenantId(TenantContext.getCurrentTenant());
        item.setPurchaseOrderId(purchaseOrderId);
        item.setReceivedQuantity(0);
        return purchaseOrderItemRepository.save(item);
    }

    private String getCurrentActor() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "system";
    }
}
