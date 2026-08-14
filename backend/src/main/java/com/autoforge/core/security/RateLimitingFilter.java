package com.autoforge.core.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, List<Long>> requestLogs = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String ip = request.getRemoteAddr();
        long now = System.currentTimeMillis();

        requestLogs.compute(ip, (key, value) -> {
            if (value == null) {
                value = new ArrayList<>();
            }
            // Remove timestamps older than 1 minute
            value.removeIf(timestamp -> now - timestamp > 60000);
            value.add(now);
            return value;
        });

        List<Long> timestamps = requestLogs.get(ip);
        if (timestamps != null && timestamps.size() > MAX_REQUESTS_PER_MINUTE) {
            log.warn("Rate limit exceeded for IP: {}", ip);
            response.setStatus(429); // Too Many Requests
            response.getWriter().write("Too Many Requests. Rate limit exceeded (Max 100 requests/min).");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
