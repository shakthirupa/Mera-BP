package com.merabp.healthcare.service;

import com.merabp.healthcare.dto.ChangePasswordRequestDTO;
import com.merabp.healthcare.dto.*;
import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.exception.DuplicateResourceException;
import com.merabp.healthcare.exception.ResourceNotFoundException;
import com.merabp.healthcare.model.OtpPurpose;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.model.RefreshToken;
import com.merabp.healthcare.repository.PatientRepository;
import com.merabp.healthcare.repository.RefreshTokenRepository;
import com.merabp.healthcare.security.JwtService;
import com.merabp.healthcare.util.HashUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final String TEMP_RESET_TOKEN = "abcd1234";

    private final PatientRepository patientRepo;
    private final OtpService otpService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepo;

    public AuthService(PatientRepository patientRepo,
                       OtpService otpService,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService,
                       RefreshTokenRepository refreshTokenRepo) {
        this.patientRepo         = patientRepo;
        this.otpService          = otpService;
        this.passwordEncoder     = passwordEncoder;
        this.jwtService          = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepo    = refreshTokenRepo;
    }

    // ── REGISTRATION ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO completeEmailSignup(
            String token,
            EmailSignupRequestDTO request) {

        if (!jwtService.isOnboardingTokenValid(token)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token");
        }

        String email = jwtService.extractEmail(token);

        if (patientRepo.existsByEmailAndDeletedFalse(email)) {
            throw new DuplicateResourceException(
                    "An account with this email already exists");
        }

        Patient patient = Patient.emailUser(
                request.getDateOfBirth(),
                request.getGender(),
                email,
                passwordEncoder.encode(request.getPassword())
        );

        patient.setTermsAcceptedAt(LocalDateTime.now());
        patientRepo.save(patient);

        String accessToken  = jwtService.generateToken(patient);
        String refreshToken = refreshTokenService.generateRefreshToken(patient);
        return AuthResponseDTO.withTokens("Registration successful.", accessToken, refreshToken);
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO loginWithEmail(EmailLoginRequestDTO request) {

        Patient patient;
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            patient = patientRepo.findByPhoneAndDeletedFalse(request.getPhone())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "Invalid phone or password."));
        } else {
            patient = findActivePatient(request.getEmail());
        }

        if (!passwordEncoder.matches(request.getPassword(), patient.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        String accessToken  = jwtService.generateToken(patient);
        String refreshToken = refreshTokenService.generateRefreshToken(patient);
        return AuthResponseDTO.withTokensAndProfile("Login successful.", accessToken, refreshToken, patient);
    }

    // ── SEND OTP ──────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO startEmailSignup(StartEmailSignupRequestDTO request) {

        if (patientRepo.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new DuplicateResourceException(
                    "An account with this email already exists");
        }

        LocalDateTime expiresAt = otpService.generateAndSendOtp(
                request.getEmail(), OtpPurpose.REGISTRATION);
        return AuthResponseDTO.otp("OTP sent. Please check your email.", expiresAt);
    }

    // ── VERIFY EMAIL OTP ──────────────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO verifyEmailSignupOtp(VerifyEmailSignupOtpRequestDTO request) {

        if (patientRepo.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new DuplicateResourceException(
                    "An account with this email already exists");
        }

        otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.REGISTRATION);

        String onboardingToken = jwtService.generateSignupOnboardingToken(request.getEmail());
        return AuthResponseDTO.onboarding(onboardingToken, "");
    }

    // ── CHANGE PASSWORD (authenticated) ──────────────────────────────────────

    @Transactional
    public AuthResponseDTO changePassword(Patient patient, ChangePasswordRequestDTO request) {

        // Reload within this transaction so Hibernate tracks the entity for dirty checking
        Patient managed = patientRepo.findByIdAndDeletedFalse(patient.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        if (managed.getPasswordHash() == null) {
            throw new BusinessRuleException("This account uses Google sign-in. Password change is not available.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), managed.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), managed.getPasswordHash())) {
            throw new BusinessRuleException("New password must be different from your current password.");
        }

        managed.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        patientRepo.save(managed);
        return AuthResponseDTO.message("Password changed successfully.");
    }

    // ── FORGOT PASSWORD — SEND OTP ────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO forgotPassword(ForgotPasswordRequestDTO request) {

        patientRepo.findByEmailAndDeletedFalse(request.getEmail())
                .ifPresent(patient ->
                        otpService.generateAndSendOtp(
                                request.getEmail(), OtpPurpose.FORGOT_PASSWORD));

        return AuthResponseDTO.message(
                "If an account exists with this email, an OTP has been sent.");
    }

    // ── FORGOT PASSWORD — VERIFY OTP ──────────────────────────────────────────

    @Transactional
    public AuthResponseDTO verifyForgotOtp(VerifyForgotOtpRequestDTO request) {

        findActivePatient(request.getEmail());
        otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.FORGOT_PASSWORD);

        return AuthResponseDTO.withToken(
                "OTP verified. Use the reset token to set your new password.",
                TEMP_RESET_TOKEN);
    }

    // ── FORGOT PASSWORD — RESET ───────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO resetPassword(ResetPasswordRequestDTO request) {

        Patient patient = findActivePatient(request.getEmail());

        if (!TEMP_RESET_TOKEN.equals(request.getResetToken())) {
            throw new BusinessRuleException("Invalid reset token.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), patient.getPasswordHash())) {
            throw new BusinessRuleException(
                    "New password must be different from your current password.");
        }

        patient.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        patientRepo.save(patient);
        return AuthResponseDTO.message("Password reset successful. You can now log in.");
    }

    // ── REFRESH TOKEN ─────────────────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO refresh(RefreshRequestDTO request) {

        String tokenHash = HashUtil.sha256(request.getRefreshToken());

        // Single DB lookup — entity passed directly into rotateRefreshToken
        // so the service never needs to look it up again
        RefreshToken existing = refreshTokenRepo
                .findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid refresh token. Please log in again."));

        Patient patient = existing.getPatient();

        if (patient.isDeleted()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Account is no longer active.");
        }

        // Pass the already-loaded entity — no second DB lookup inside the service
        String newRefreshToken = refreshTokenService.rotateRefreshToken(existing, patient);
        String newAccessToken  = jwtService.generateToken(patient);

        return AuthResponseDTO.withTokens(
                "Token refreshed successfully.", newAccessToken, newRefreshToken);
    }

    // ── LOGOUT ────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponseDTO logout(Long patientId) {
        refreshTokenService.revokeAll(patientId);
        return AuthResponseDTO.message("Logged out successfully.");
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Patient findActivePatient(String email) {
        return patientRepo.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with this email"));
    }
}