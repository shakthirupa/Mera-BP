package com.merabp.healthcare.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "patients",
        indexes = {
                @Index(name = "idx_patient_email",     columnList = "email"),
                @Index(name = "idx_patient_phone",     columnList = "phone"),
                @Index(name = "idx_patient_google_id", columnList = "google_id")
        }
)
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(unique = true, length = 150)
    private String email;

    @Column(unique = true, length = 15)
    private String phone;

    // Nullable — Google-only users have no password
    @Column(name = "password_hash")
    private String passwordHash;

    // Unique Google subject ID — null for email-only users
    @Column(name = "google_id", unique = true, length = 100)
    private String googleId;

    // How this account was created / what methods are linked
    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 10)
    private AuthProvider authProvider = AuthProvider.EMAIL;

    // Stored as timestamp for legal purposes — not just a boolean
    @Column(name = "terms_accepted_at")
    private LocalDateTime termsAcceptedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean deleted = false;

    protected Patient() {}

    // ── Email/password registration constructor ────────────────────────────────
    public static Patient emailUser(String name,
                                    LocalDate dob,
                                    Gender gender,
                                    String email,
                                    String passwordHash) {

        Patient p = new Patient();
        p.name = name;
        p.dateOfBirth = dob;
        p.gender = gender;
        p.email = email;
        p.passwordHash = passwordHash;
        p.authProvider = AuthProvider.EMAIL;

        return p;
    }

    public static Patient googleUser(String name,
                                     LocalDate dob,
                                     Gender gender,
                                     String email,
                                     String googleId) {

        Patient p = new Patient();
        p.name = name;
        p.dateOfBirth = dob;
        p.gender = gender;
        p.email = email;
        p.googleId = googleId;
        p.authProvider = AuthProvider.GOOGLE;

        return p;
    }

    public static Patient phoneUser(String name,
                                    LocalDate dob,
                                    Gender gender,
                                    String phone) {

        Patient p = new Patient();
        p.name = name;
        p.dateOfBirth = dob;
        p.gender = gender;
        p.phone = phone;
        p.authProvider = AuthProvider.PHONE;

        return p;
    }

    // ── Google registration constructor ───────────────────────────────────────
    // Google already verified the email so emailVerified = true immediately
    public Patient(String name, LocalDate dateOfBirth, Gender gender,
                   String email, String googleId) {
        this.name          = name;
        this.dateOfBirth   = dateOfBirth;
        this.gender        = gender;
        this.email         = email;
        this.googleId      = googleId;
        this.authProvider  = AuthProvider.GOOGLE;
    }

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId()                          { return id; }
    public String getName()                      { return name; }
    public LocalDate getDateOfBirth()            { return dateOfBirth; }
    public Gender getGender()                    { return gender; }
    public String getEmail()                     { return email; }
    public String getPhone()                     { return phone; }
    public String getPasswordHash()              { return passwordHash; }
    public String getGoogleId()                  { return googleId; }
    public AuthProvider getAuthProvider()        { return authProvider; }
    public LocalDateTime getTermsAcceptedAt()    { return termsAcceptedAt; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
    public boolean isDeleted()                   { return deleted; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setName(String name)                          { this.name = name; }
    public void setDateOfBirth(LocalDate dob)                 { this.dateOfBirth = dob; }
    public void setGender(Gender gender)                      { this.gender = gender; }
    public void setEmail(String email)                        { this.email = email; }
    public void setPhone(String phone)                        { this.phone = phone; }
    public void setPasswordHash(String passwordHash)          { this.passwordHash = passwordHash; }
    public void setGoogleId(String googleId)                  { this.googleId = googleId; }
    public void setAuthProvider(AuthProvider authProvider)    { this.authProvider = authProvider; }
    public void setTermsAcceptedAt(LocalDateTime acceptedAt)  { this.termsAcceptedAt = acceptedAt; }
    public void setDeleted(boolean deleted)                   { this.deleted = deleted; }
}