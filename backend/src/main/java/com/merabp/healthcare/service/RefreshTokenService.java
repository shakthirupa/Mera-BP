package com.merabp.healthcare.service;

import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.model.RefreshToken;
import com.merabp.healthcare.repository.RefreshTokenRepository;
import com.merabp.healthcare.util.HashUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private final RefreshTokenRepository refreshTokenRepo;
    private final TokenRevocationService revocationService;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepo,
                               TokenRevocationService revocationService) {
        this.refreshTokenRepo = refreshTokenRepo;
        this.revocationService = revocationService;
    }

    // ── New login — always starts a new family ────────────────────────────────

    @Transactional
    public String generateRefreshToken(Patient patient) {
        return generateRefreshToken(patient, UUID.randomUUID().toString());
    }

    // ── Internal — carries family forward during rotation ─────────────────────

    @Transactional
    public String generateRefreshToken(Patient patient, String familyId) {
        byte[] tokenBytes = new byte[64];
        SECURE_RANDOM.nextBytes(tokenBytes);
        String plainToken = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

        String tokenHash = HashUtil.sha256(plainToken);
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000);

        RefreshToken refreshToken = new RefreshToken(patient, tokenHash, expiresAt, familyId);
        refreshTokenRepo.save(refreshToken);

        return plainToken;
    }

    // ── Revoke entire family in its own transaction ───────────────────────────
    // REQUIRES_NEW ensures this commits even if the outer transaction rolls back

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void revokeFamilyOnBreach(String familyId, Long patientId) {
        log.warn("Refresh token reuse detected for patient {}. Revoking family {}.",
                patientId, familyId);
        refreshTokenRepo.revokeAllByFamilyId(familyId);
    }

    // ── Revoke single expired token in its own transaction ────────────────────

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void revokeTokenOnExpiry(RefreshToken token) {
        token.setRevoked(true);
    }

    // ── Rotate — accepts already-loaded token to avoid double DB lookup ───────

    @Transactional
    public String rotateRefreshToken(RefreshToken existing, Patient patient) {

        // ✅ 2. Check revoked
        if (existing.isRevoked()) {
            throw new BusinessRuleException("TOKEN_REVOKED",
                    "Refresh token revoked. Please login again.");
        }

        // ✅ 3. Check expiry
        if (existing.isExpired()) {
            throw new BusinessRuleException("TOKEN_EXPIRED",
                    "Refresh token expired. Please login again.");
        }

        // ✅ 4. ATOMIC update (FIXES race condition + reuse detection)
        int updated = refreshTokenRepo.markUsedIfNotUsed(existing.getId());

        if (updated == 0) {
            // 🔥 TOKEN REUSE DETECTED (REAL SECURITY EVENT)

            revocationService.revokeFamily(
                    existing.getFamilyId()
            );

            throw new BusinessRuleException(
                    "TOKEN_REUSE_DETECTED",
                    "Security violation detected. Please log in again."
            );
        }

        // ✅ 5. Generate new token (rotation)
        return generateRefreshToken(patient, existing.getFamilyId());
    }

    // ── Logout — revoke all tokens for patient ────────────────────────────────

    @Transactional
    public void revokeAll(Long patientId) {
        refreshTokenRepo.revokeAllByPatientId(patientId);
    }

    // ── Scheduled cleanup — runs every day at 3 AM ───────────────────────────

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepo.deleteAllExpiredOrRevoked(LocalDateTime.now());
        log.info("Expired and revoked refresh tokens cleaned up");
    }
}