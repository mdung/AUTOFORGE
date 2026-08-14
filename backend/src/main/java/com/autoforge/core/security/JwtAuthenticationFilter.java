package com.autoforge.core.security;

import com.autoforge.core.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Check if there is an explicit X-Tenant-ID header (useful for public endpoints, or debugging)
        String tenantHeader = request.getHeader("X-Tenant-ID");
        if (tenantHeader != null) {
            try {
                TenantContext.setCurrentTenant(UUID.fromString(tenantHeader));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid UUID in X-Tenant-ID header: {}", tenantHeader);
            }
        }

        String branchHeader = request.getHeader("X-Branch-ID");
        if (branchHeader != null) {
            try {
                com.autoforge.core.tenant.BranchContext.setCurrentBranch(UUID.fromString(branchHeader));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid UUID in X-Branch-ID header: {}", branchHeader);
            }
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            TenantContext.clear();
            com.autoforge.core.tenant.BranchContext.clear();
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtUtils.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UUID tenantId = jwtUtils.extractTenantId(jwt);
                String role = jwtUtils.extractRole(jwt);

                if (tenantId != null) {
                    TenantContext.setCurrentTenant(tenantId);
                }

                if (jwtUtils.validateToken(jwt, userEmail)) {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail,
                            jwt,
                            Collections.singletonList(authority)
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Clean up the context to prevent thread-local leakage
            TenantContext.clear();
            com.autoforge.core.tenant.BranchContext.clear();
        }
    }
}
