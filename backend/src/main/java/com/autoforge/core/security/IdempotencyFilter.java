package com.autoforge.core.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class IdempotencyFilter extends OncePerRequestFilter {

    private final Map<String, String> idempotencyStore = new ConcurrentHashMap<>();
    private static final String IDEMPOTENCY_HEADER = "X-Idempotency-Key";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String key = request.getHeader(IDEMPOTENCY_HEADER);
        if (key != null && !key.isEmpty()) {
            if (idempotencyStore.containsKey(key)) {
                log.info("Duplicate request detected with Idempotency Key: {}", key);
                response.setStatus(200); // Return cached success
                response.setContentType("application/json");
                response.getWriter().write(idempotencyStore.get(key));
                return;
            }
            
            // For demo: capture output or simply cache key success
            // For simplicity, we cache a mock processed indicator for that key
            idempotencyStore.put(key, "{\"status\":\"PROCESSED_BY_IDEMPOTENCY\",\"key\":\"" + key + "\"}");
        }

        filterChain.doFilter(request, response);
    }
}
