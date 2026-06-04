package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.*;
import com.merabp.healthcare.dto.ChangePasswordRequestDTO;
import com.merabp.healthcare.dto.GoogleCodeRequestDTO;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.service.AuthService;
import com.merabp.healthcare.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;

    public AuthController(AuthService authService,
                          GoogleAuthService googleAuthService) {
        this.authService       = authService;
        this.googleAuthService = googleAuthService;
    }

    // ── Email / Password ──────────────────────────────────────────────────────

    @PostMapping("/start-email-signup")
    public ResponseEntity<AuthResponseDTO> startEmailSignup(
            @Valid @RequestBody StartEmailSignupRequestDTO request) {

        return ResponseEntity.ok(authService.startEmailSignup(request));
    }

    @PostMapping("/verify-email-signup-otp")
    public ResponseEntity<AuthResponseDTO> verifyEmailSignupOtp(
            @Valid @RequestBody VerifyEmailSignupOtpRequestDTO request) {

        return ResponseEntity.ok(authService.verifyEmailSignupOtp(request));
    }

/*    @PostMapping("/resend-email-signup-otp")
    public ResponseEntity<AuthResponseDTO> resendEmailSignupOtp(
            @Valid @RequestBody StartEmailSignupRequestDTO request) {

        return ResponseEntity.ok(authService.resendEmailSignupOtp(request));
    }
*/
    @PostMapping("/complete-email-signup")
    public ResponseEntity<AuthResponseDTO> completeEmailSignup(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody EmailSignupRequestDTO request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = authHeader.substring(7);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.completeEmailSignup(token, request));
    }

    // { email, password }
    // 200 + JWT     → verified, logged in
    // 403           → correct password but unverified, navigate to OTP screen
    // 401           → wrong credentials
    @PostMapping("/login/email")
    public ResponseEntity<AuthResponseDTO> loginWithEmail(
            @Valid @RequestBody EmailLoginRequestDTO request) {
        return ResponseEntity.ok(authService.loginWithEmail(request));
    }

    @PostMapping("/login/phone")
    public ResponseEntity<AuthResponseDTO> loginWithPhone(
            @Valid @RequestBody EmailLoginRequestDTO request) {
        return ResponseEntity.ok(authService.loginWithEmail(request));
    }

    // ── Google Auth ───────────────────────────────────────────────────────────

    // { idToken }
    // 200 + JWT              → existing user, signed in
    // 200 + onboardingToken  → new user, navigate to DOB/gender/T&C screens
    @PostMapping("/google")
    public ResponseEntity<AuthResponseDTO> googleAuth(
            @Valid @RequestBody GoogleAuthRequestDTO request) {
        return ResponseEntity.ok(googleAuthService.handleGoogleAuth(request));
    }

    @PostMapping("/google/code")
    public ResponseEntity<AuthResponseDTO> googleAuthCode(
            @RequestBody GoogleCodeRequestDTO request) {
        return ResponseEntity.ok(googleAuthService.handleGoogleCode(request));
    }

    @PostMapping("/google/verify-otp")
    public ResponseEntity<AuthResponseDTO> verifyGoogleOtp(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody VerifyForgotOtpRequestDTO request) {

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new RuntimeException("Missing token");

        return ResponseEntity.ok(
                googleAuthService.verifyGoogleOtp(authHeader.substring(7), request.getOtp()));
    }

    // { onboardingToken, dateOfBirth, gender, termsAccepted }
    // 200 + JWT → account created, signed in
    // 401       → onboarding token expired, send back to login
    @PostMapping("/google/complete")
    public ResponseEntity<AuthResponseDTO> googleComplete(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody GoogleCompleteRequestDTO request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = authHeader.substring(7);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(googleAuthService.completeOnboarding(token, request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthResponseDTO> changePassword(
            @AuthenticationPrincipal Patient patient,
            @Valid @RequestBody ChangePasswordRequestDTO request) {
        return ResponseEntity.ok(authService.changePassword(patient, request));
    }

    // ── Token management ──────────────────────────────────────────────────────

    // { refreshToken } → new accessToken + new refreshToken (sliding expiry)
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refresh(
            @Valid @RequestBody RefreshRequestDTO request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    // Requires valid JWT — revokes all refresh tokens for the patient
    @PostMapping("/logout")
    public ResponseEntity<AuthResponseDTO> logout(
            @AuthenticationPrincipal Patient patient) {
        return ResponseEntity.ok(authService.logout(patient.getId()));
    }

    // ── Forgot password ───────────────────────────────────────────────────────

    // { email } → OTP sent
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponseDTO> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    // { email, otp } → returns reset token
    @PostMapping("/verify-forgot-otp")
    public ResponseEntity<AuthResponseDTO> verifyForgotOtp(
            @Valid @RequestBody VerifyForgotOtpRequestDTO request) {
        return ResponseEntity.ok(authService.verifyForgotOtp(request));
    }

    // { email, resetToken, newPassword }
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponseDTO> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}