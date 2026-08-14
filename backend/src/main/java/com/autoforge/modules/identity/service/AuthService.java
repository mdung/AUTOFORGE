package com.autoforge.modules.identity.service;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.core.security.JwtUtils;
import com.autoforge.modules.identity.dto.LoginRequest;
import com.autoforge.modules.identity.dto.LoginResponse;
import com.autoforge.modules.identity.dto.RegisterRequest;
import com.autoforge.modules.identity.model.User;
import com.autoforge.modules.identity.repository.UserRepository;
import com.autoforge.modules.tenant.model.Branch;
import com.autoforge.modules.tenant.model.Organization;
import com.autoforge.modules.tenant.model.Tenant;
import com.autoforge.modules.tenant.model.Bay;
import com.autoforge.modules.tenant.repository.BranchRepository;
import com.autoforge.modules.tenant.repository.OrganizationRepository;
import com.autoforge.modules.tenant.repository.TenantRepository;
import com.autoforge.modules.tenant.repository.BayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TenantRepository tenantRepository;
    private final OrganizationRepository organizationRepository;
    private final BranchRepository branchRepository;
    private final BayRepository bayRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // 1. Create Tenant
        Tenant tenant = new Tenant();
        tenant.setName(request.getCompanyName());
        tenant.setPlan("STARTER");
        tenant = tenantRepository.save(tenant);

        // Set TenantContext temporarily for initialization
        TenantContext.setCurrentTenant(tenant.getId());

        // 2. Create Organization
        Organization org = new Organization();
        org.setTenantId(tenant.getId());
        org.setName(request.getCompanyName() + " Org");
        org = organizationRepository.save(org);

        // 3. Create Branch
        Branch branch = new Branch();
        branch.setTenantId(tenant.getId());
        branch.setOrgId(org.getId());
        branch.setName(request.getBranchName());
        branch.setAddress(request.getBranchAddress());
        branch = branchRepository.save(branch);

        // 4. Create a default service bay for convenience
        Bay bay = new Bay();
        bay.setTenantId(tenant.getId());
        bay.setBranchId(branch.getId());
        bay.setName("Bay 01");
        bay.setType("GENERAL");
        bay.setStatus("AVAILABLE");
        bayRepository.save(bay);

        // 5. Create Tenant Admin User
        User user = new User();
        user.setTenantId(tenant.getId());
        user.setBranchId(branch.getId());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole("TENANT_ADMIN");
        user.setStatus("ACTIVE");
        user = userRepository.save(user);

        // Generate JWT
        String token = jwtUtils.generateToken(user.getEmail(), tenant.getId(), user.getRole(), branch.getId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail(), tenant.getId());

        TenantContext.clear();

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .tenantId(tenant.getId())
                .tenantName(tenant.getName())
                .branchId(branch.getId())
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalArgumentException("User account is inactive");
        }

        Tenant tenant = tenantRepository.findById(user.getTenantId())
                .orElseThrow(() -> new IllegalStateException("Tenant not found"));

        String token = jwtUtils.generateToken(user.getEmail(), tenant.getId(), user.getRole(), user.getBranchId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getTenantId());

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .tenantId(user.getTenantId())
                .tenantName(tenant.getName())
                .branchId(user.getBranchId())
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse refreshToken(String refreshToken) {
        try {
            if (!jwtUtils.isRefreshToken(refreshToken)) {
                throw new IllegalArgumentException("Invalid refresh token");
            }
            String email = jwtUtils.extractUsername(refreshToken);
            UUID tenantId = jwtUtils.extractTenantId(refreshToken);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            if (!"ACTIVE".equals(user.getStatus())) {
                throw new IllegalArgumentException("User account is inactive");
            }

            Tenant tenant = tenantRepository.findById(user.getTenantId())
                    .orElseThrow(() -> new IllegalStateException("Tenant not found"));

            String newAccessToken = jwtUtils.generateToken(user.getEmail(), user.getTenantId(), user.getRole(), user.getBranchId());
            String newRefreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getTenantId());

            return LoginResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .tenantId(user.getTenantId())
                    .tenantName(tenant.getName())
                    .branchId(user.getBranchId())
                    .build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
    }
}
