package com.autoforge.core.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SecureLinkService {

    private static final String SALT = "autoforge-secret-salt-2026";
    private final Set<String> revokedTokens = ConcurrentHashMap.newKeySet();

    public String generateSignedLink(String basePath, UUID resourceId, long expiryDurationMs) {
        long expiryTime = System.currentTimeMillis() + expiryDurationMs;
        String signature = computeSignature(resourceId, expiryTime);
        
        return String.format("%s/%s?expiry=%d&sig=%s", basePath, resourceId, expiryTime, signature);
    }

    public boolean validateSignedLink(UUID resourceId, long expiryTime, String signature) {
        String token = resourceId.toString() + expiryTime + signature;
        if (revokedTokens.contains(token)) {
            log.warn("Link validation failed: token has been revoked.");
            return false;
        }

        if (System.currentTimeMillis() > expiryTime) {
            log.warn("Link validation failed: URL has expired.");
            return false;
        }

        String expectedSignature = computeSignature(resourceId, expiryTime);
        return expectedSignature.equals(signature);
    }

    public void revokeLink(UUID resourceId, long expiryTime, String signature) {
        String token = resourceId.toString() + expiryTime + signature;
        revokedTokens.add(token);
        log.info("Secure link revoked successfully: {}", token);
    }

    private String computeSignature(UUID resourceId, long expiryTime) {
        try {
            String input = resourceId.toString() + expiryTime + SALT;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error computing link signature", e);
        }
    }
}
