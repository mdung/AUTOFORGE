package com.autoforge.modules.repairorder.controller;

import com.autoforge.modules.repairorder.model.LaborCatalogItem;
import com.autoforge.modules.repairorder.repository.LaborCatalogItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/labor-catalog")
@RequiredArgsConstructor
public class LaborCatalogController {

    private final LaborCatalogItemRepository laborCatalogItemRepository;

    @GetMapping
    public ResponseEntity<List<LaborCatalogItem>> getCatalog(@RequestHeader("X-Tenant-ID") String tenantIdStr) {
        UUID tenantId = UUID.fromString(tenantIdStr);
        return ResponseEntity.ok(laborCatalogItemRepository.findByTenantId(tenantId));
    }

    @PostMapping
    public ResponseEntity<LaborCatalogItem> addCatalogItem(
            @RequestHeader("X-Tenant-ID") String tenantIdStr,
            @RequestBody LaborCatalogItem item) {
        item.setTenantId(UUID.fromString(tenantIdStr));
        return ResponseEntity.ok(laborCatalogItemRepository.save(item));
    }
}
