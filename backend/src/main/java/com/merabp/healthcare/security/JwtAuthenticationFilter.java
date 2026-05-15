package com.merabp.healthcare.security;

import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.PatientRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final PatientRepository patientRepo;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   PatientRepository patientRepo) {
        this.jwtService  = jwtService;
        this.patientRepo = patientRepo;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // No token — pass through, SecurityConfig blocks protected routes
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        // Invalid or expired token — pass through, SecurityConfig blocks it
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Onboarding tokens are NOT real sessions — they only unlock /auth/google/complete
        // Reject them here so they cannot authenticate protected routes
        if (jwtService.isOnboardingToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Already authenticated in this request — skip
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        Long patientId = jwtService.extractPatientId(token);

        Patient patient = patientRepo
                .findByIdAndDeletedFalse(patientId)
                .orElse(null);
        // Google patients have emailVerified = true by default
        // so this check works for both auth methods
        if (patient == null) {
            filterChain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        patient,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_PATIENT"))
                );

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}