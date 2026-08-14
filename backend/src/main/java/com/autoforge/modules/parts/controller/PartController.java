package com.autoforge.modules.parts.controller;

import com.autoforge.modules.parts.model.Part;
import com.autoforge.modules.parts.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/parts")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;
    private final com.autoforge.modules.parts.service.SupplierClient supplierClient;

    @GetMapping("/marketplace")
    public ResponseEntity<List<Part>> searchMarketplace(@RequestParam String query) {
        return ResponseEntity.ok(supplierClient.searchMarketplaceParts(query));
    }

    @GetMapping
    public ResponseEntity<List<Part>> getAllParts() {
        return ResponseEntity.ok(partService.getAllParts());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<Part>> getAllPartsPaginated(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(partService.getAllParts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Part> getPartById(@PathVariable UUID id) {
        return ResponseEntity.ok(partService.getPartById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN', 'ROLE_PARTS_MANAGER')")
    public ResponseEntity<Part> createPart(@jakarta.validation.Valid @RequestBody Part part) {
        return ResponseEntity.ok(partService.createPart(part));
    }

    @PutMapping("/{id}/stock")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_SERVICE_ADVISOR', 'ROLE_MASTER_TECHNICIAN', 'ROLE_PARTS_MANAGER')")
    public ResponseEntity<Part> updateStock(@PathVariable UUID id, @RequestParam Integer change) {
        return ResponseEntity.ok(partService.updateStock(id, change));
    }
}
