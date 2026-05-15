package com.merabp.healthcare.security;

import com.merabp.healthcare.model.Patient;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    // Normal session token expiry — e.g. 86400000 (24 hours)
    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // Onboarding token expiry — short-lived, default 10 minutes
    // Override in application.properties: jwt.onboarding-expiration-ms=600000
    @Value("${jwt.onboarding-expiration-ms:600000}")
    private long onboardingExpirationMs;

    // ── Session token — issued after full login/registration ──────────────────

    public String generateToken(Patient patient) {
        return Jwts.builder()
                .subject(patient.getEmail())
                .claim("patientId", patient.getId())
                .claim("type", "SESSION")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // ── Onboarding token — issued for new Google users only ───────────────────
    // Holds Google profile so backend can create the Patient after T&C accepted
    // NOT a real session — rejected by JwtAuthenticationFilter for protected routes

    public String generateOnboardingToken(String googleId, String email, String name) {
        return Jwts.builder()
                .subject(email)
                .claim("googleId", googleId)
                .claim("name", name)
                .claim("type", "ONBOARDING")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + onboardingExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateSignupOnboardingToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("type", "ONBOARDING")
                .claim("method", "EMAIL")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + onboardingExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // ── Validation ────────────────────────────────────────────────────────────

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isOnboardingTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return "ONBOARDING".equals(claims.get("type", String.class))
                    && !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Returns true if the token is an onboarding token (not a real session)
    // Used by JwtAuthenticationFilter to block onboarding tokens from protected routes
    public boolean isOnboardingToken(String token) {
        try {
            return "ONBOARDING".equals(
                    extractClaims(token).get("type", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isEmailSignupToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return "ONBOARDING".equals(claims.get("type", String.class))
                    && "EMAIL".equals(claims.get("method", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── Claim extractors ──────────────────────────────────────────────────────

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public Long extractPatientId(String token) {
        return extractClaims(token).get("patientId", Long.class);
    }

    public String extractGoogleId(String token) {
        return extractClaims(token).get("googleId", String.class);
    }

    public String extractName(String token) {
        return extractClaims(token).get("name", String.class);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}