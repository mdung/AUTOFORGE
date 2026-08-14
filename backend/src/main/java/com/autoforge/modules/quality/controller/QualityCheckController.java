package com.autoforge.modules.quality.controller;

import com.autoforge.modules.quality.model.QualityCheck;
import com.autoforge.modules.quality.service.QualityCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/qualitychecks")
@RequiredArgsConstructor
public class QualityCheckController {

    private final QualityCheckService qualityCheckService;

    @GetMapping("/repairorders/{roId}")
    public ResponseEntity<List<QualityCheck>> getQualityChecksForRO(@PathVariable UUID roId) {
        return ResponseEntity.ok(qualityCheckService.getQualityChecksForRO(roId));
    }

    @PostMapping
    public ResponseEntity<QualityCheck> performQualityCheck(@RequestBody QualityCheck check) {
        return ResponseEntity.ok(qualityCheckService.performQualityCheck(check));
    }
}
