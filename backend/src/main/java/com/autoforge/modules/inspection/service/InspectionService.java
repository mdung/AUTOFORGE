package com.autoforge.modules.inspection.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.inspection.model.Inspection;
import com.autoforge.modules.inspection.model.InspectionItem;
import com.autoforge.modules.inspection.repository.InspectionItemRepository;
import com.autoforge.modules.inspection.repository.InspectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InspectionService {

    private final InspectionRepository inspectionRepository;
    private final InspectionItemRepository inspectionItemRepository;

    @Transactional(readOnly = true)
    public List<Inspection> getAllInspections() {
        return inspectionRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @Transactional(readOnly = true)
    public Inspection getInspectionById(UUID id) {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inspection not found"));
        if (!inspection.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        return inspection;
    }

    @Transactional(readOnly = true)
    public List<InspectionItem> getInspectionItems(UUID inspectionId) {
        return inspectionItemRepository.findAllByTenantIdAndInspectionId(TenantContext.getCurrentTenant(), inspectionId);
    }

    @Transactional
    public Inspection startInspection(Inspection inspection) {
        UUID tenantId = TenantContext.getCurrentTenant();
        inspection.setTenantId(tenantId);
        inspection.setStatus("IN_PROGRESS");
        final Inspection saved = inspectionRepository.save(inspection);

        // Pre-populate standard multi-point inspection items
        List<String[]> defaultItems = new ArrayList<>();
        defaultItems.add(new String[]{"Engine Oil", "ENGINE"});
        defaultItems.add(new String[]{"Coolant Fluid Level", "ENGINE"});
        defaultItems.add(new String[]{"Battery Voltage", "ELECTRICAL"});
        defaultItems.add(new String[]{"Front Brake Pads Thickness", "BRAKES"});
        defaultItems.add(new String[]{"Rear Brake Pads Thickness", "BRAKES"});
        defaultItems.add(new String[]{"Tire Tread Depth", "TIRES"});
        defaultItems.add(new String[]{"Air Conditioning Temperature", "AC"});
        defaultItems.add(new String[]{"Suspension Shock Absorbers", "SUSPENSION"});

        for (String[] item : defaultItems) {
            InspectionItem ii = new InspectionItem();
            ii.setTenantId(tenantId);
            ii.setInspectionId(saved.getId());
            ii.setName(item[0]);
            ii.setCategory(item[1]);
            ii.setStatus("GOOD");
            inspectionItemRepository.save(ii);
        }

        return saved;
    }

    @Transactional
    public InspectionItem updateInspectionItem(UUID itemId, InspectionItem details) {
        InspectionItem item = inspectionItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Inspection item not found"));
        if (!item.getTenantId().equals(TenantContext.getCurrentTenant())) {
            throw new SecurityException("Access Denied: Tenant mismatch");
        }
        item.setStatus(details.getStatus());
        item.setMeasurement(details.getMeasurement());
        item.setUnit(details.getUnit());
        item.setRecommendation(details.getRecommendation());
        item.setNotes(details.getNotes());
        return inspectionItemRepository.save(item);
    }

    @Transactional
    public Inspection completeInspection(UUID id) {
        Inspection inspection = getInspectionById(id);
        inspection.setStatus("COMPLETED");
        return inspectionRepository.save(inspection);
    }
}
