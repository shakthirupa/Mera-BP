package com.merabp.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "otp_verifications",
        indexes = {
                @Index(name = "idx_otp_email", columnList = "email")
        }
)
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Not a FK — email may belong to an unverified patient
    // We look up by email directly, keeping this decoupled
    @Column(nullable = false, length = 150)
    private String email;

    // Stores SHA-256 hash of the OTP — never plain text
    // SHA-256 hex string is always exactly 64 characters
    @Column(nullable = false, length = 64)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OtpPurpose purpose;

    protected OtpVerification() {}

    public OtpVerification(String email, String otp,
                           LocalDateTime expiresAt, OtpPurpose purpose) {
        this.email     = email;
        this.otp       = otp;
        this.expiresAt = expiresAt;
        this.purpose   = purpose;
    }

    // Getters
    public Long getId()                  { return id; }
    public String getEmail()             { return email; }
    public String getOtp()               { return otp; }
    public LocalDateTime getExpiresAt()  { return expiresAt; }
    public boolean isUsed()              { return used; }
    public OtpPurpose getPurpose()       { return purpose; }

    // Setters
    public void setUsed(boolean used)    { this.used = used; }
}