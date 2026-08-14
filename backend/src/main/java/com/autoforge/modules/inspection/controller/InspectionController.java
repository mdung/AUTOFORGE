package com.autoforge.modules.inspection.controller;

import com.autoforge.modules.inspection.model.Inspection;
import com.autoforge.modules.inspection.model.InspectionItem;
import com.autoforge.modules.inspection.service.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/inspections")
@RequiredArgsConstructor
public class InspectionController {

    private final InspectionService inspectionService;

    @GetMapping
    public ResponseEntity<List<Inspection>> getAllInspections() {
        return ResponseEntity.ok(inspectionService.getAllInspections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inspection> getInspectionById(@PathVariable UUID id) {
        return ResponseEntity.ok(inspectionService.getInspectionById(id));
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<InspectionItem>> getInspectionItems(@PathVariable UUID id) {
        return ResponseEntity.ok(inspectionService.getInspectionItems(id));
    }

    @PostMapping
    public ResponseEntity<Inspection> startInspection(@RequestBody Inspection inspection) {
        return ResponseEntity.ok(inspectionService.startInspection(inspection));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<InspectionItem> updateInspectionItem(@PathVariable UUID itemId, @RequestBody InspectionItem item) {
        return ResponseEntity.ok(inspectionService.updateInspectionItem(itemId, item));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Inspection> completeInspection(@PathVariable UUID id) {
        return ResponseEntity.ok(inspectionService.completeInspection(id));
    }
}
