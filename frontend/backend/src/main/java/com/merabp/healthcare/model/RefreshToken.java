package com.merabp.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "refresh_tokens",
        indexes = {
                @Index(name = "idx_refresh_token_patient", columnList = "patient_id"),
                @Index(name = "idx_refresh_token_family",  columnList = "family_id")
        }
)
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(nullable = false, length = 36)
    private String familyId;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean revoked = false;

    @Column(nullable = false)
    private boolean used = false;

    protected RefreshToken() {}

    public RefreshToken(Patient patient, String tokenHash, LocalDateTime expiresAt, String familyId) {
        this.patient   = patient;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
        this.familyId  = familyId;
        this.used      = false;
        this.revoked   = false;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    // Getters
    public Long getId()                       { return id; }
    public Patient getPatient()               { return patient; }
    public String getTokenHash()              { return tokenHash; }
    public String getFamilyId()               { return familyId; }
    public LocalDateTime getExpiresAt()       { return expiresAt; }
    public boolean isRevoked()                { return revoked; }
    public boolean isUsed()                   { return used; }

    // Setters
    public void setRevoked(boolean revoked)           { this.revoked = revoked; }
    public void setUsed(boolean used)                 { this.used = used; }
    public void setTokenHash(String tokenHash)        { this.tokenHash = tokenHash; }
    public void setFamilyId(String familyId)          { this.familyId = familyId; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}