package com.autoforge.modules.estimate.controller;

import com.autoforge.core.security.SecureLinkService;
import com.autoforge.modules.estimate.model.Estimate;
import com.autoforge.modules.estimate.service.EstimateService;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/public/estimates")
@RequiredArgsConstructor
public class PublicEstimateController {

    private final EstimateService estimateService;
    private final SecureLinkService secureLinkService;

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approvePublicEstimate(
            @PathVariable UUID id,
            @RequestParam long expiry,
            @RequestParam String sig,
            @RequestBody PublicApprovalRequest request) {
        
        // Validate signed link
        if (!secureLinkService.validateSignedLink(id, expiry, sig)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Link phê duyệt không hợp lệ hoặc đã hết hạn!");
        }

        // Execute guest approval
        Estimate updated = estimateService.submitApproval(id, request.getApprovedItemIds(), request.getSignature());
        
        // Revoke link after successful approval to enforce single-use/security
        secureLinkService.revokeLink(id, expiry, sig);

        return ResponseEntity.ok(updated);
    }

    @Getter
    @Setter
    public static class PublicApprovalRequest {
        private List<UUID> approvedItemIds;
        private String signature;
    }
}
