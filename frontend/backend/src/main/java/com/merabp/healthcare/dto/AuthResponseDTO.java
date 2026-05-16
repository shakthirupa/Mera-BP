package com.merabp.healthcare.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.merabp.healthcare.model.Patient;

import java.time.LocalDateTime;

// Null fields are omitted from JSON response
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponseDTO {

    private String message;
    private String accessToken;
    private String refreshToken;

    private String onboardingToken;
    private String name;
    private String status;
    private LocalDateTime otpExpiresAt;

    // Profile fields — included on login so frontend skips a second /profile call
    private String email;
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String authProvider;

    // ── Factory methods ───────────────────────────────────────────────────────

    // Message only — e.g. "Registration successful. Please verify your email."
    public static AuthResponseDTO message(String message) {
        AuthResponseDTO dto = new AuthResponseDTO();
        dto.message = message;
        return dto;
    }

    // Access token only — e.g. password reset flow
    public static AuthResponseDTO withToken(String message, String accessToken) {
        AuthResponseDTO dto = new AuthResponseDTO();
        dto.message     = message;
        dto.accessToken = accessToken;
        return dto;
    }

    // Full token pair — normal login/register success
    public static AuthResponseDTO withTokens(String message,
                                             String accessToken,
                                             String refreshToken) {
        AuthResponseDTO dto = new AuthResponseDTO();
        dto.message      = message;
        dto.accessToken  = accessToken;
        dto.refreshToken = refreshToken;
        return dto;
    }

    public static AuthResponseDTO withTokensAndProfile(String message,
                                                       String accessToken,
                                                       String refreshToken,
                                                       Patient patient) {
        AuthResponseDTO dto = withTokens(message, accessToken, refreshToken);
        dto.name         = patient.getName();
        dto.email        = patient.getEmail();
        dto.phone        = patient.getPhone();
        dto.dateOfBirth  = patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : null;
        dto.gender       = patient.getGender() != null ? patient.getGender().name() : null;
        dto.authProvider = patient.getAuthProvider() != null ? patient.getAuthProvider().name() : null;
        return dto;
    }

    public static AuthResponseDTO otp(String message, LocalDateTime otpExpiresAt) {
        AuthResponseDTO dto = new AuthResponseDTO();
        dto.message     = message;
        dto.otpExpiresAt = otpExpiresAt;
        return dto;
    }

    // Onboarding required — new Google user, needs DOB + gender + T&C
    public static AuthResponseDTO onboarding(String onboardingToken, String name) {
        AuthResponseDTO dto = new AuthResponseDTO();
        dto.status          = "NEEDS_ONBOARDING";
        dto.message         = "Please complete your profile to continue.";
        dto.onboardingToken = onboardingToken;
        dto.name = name;
        return dto;
    }

    // ── Getters ───────────────────────────────────────────────────────────────
    public String getMessage()         { return message; }
    public String getAccessToken()     { return accessToken; }
    public String getRefreshToken()    { return refreshToken; }
    public String getOnboardingToken() { return onboardingToken; }
    public String getStatus()          { return status; }
    public LocalDateTime getOtpExpiresAt() { return otpExpiresAt; }
    public String getName()            { return name; }
    public String getEmail()           { return email; }
    public String getPhone()           { return phone; }
    public String getDateOfBirth()     { return dateOfBirth; }
    public String getGender()          { return gender; }
    public String getAuthProvider()    { return authProvider; }


    // ── Setters ───────────────────────────────────────────────────────────────
    public void setMessage(String message)               { this.message = message; }
    public void setAccessToken(String accessToken)       { this.accessToken = accessToken; }
    public void setRefreshToken(String refreshToken)     { this.refreshToken = refreshToken; }
    public void setOnboardingToken(String token)         { this.onboardingToken = token; }
    public void setStatus(String status)                 { this.status = status; }
    public void setOtpExpiresAt(LocalDateTime otpExpiresAt) { this.otpExpiresAt = otpExpiresAt; }
    public void setName(String name)                     { this.name = name; }
}