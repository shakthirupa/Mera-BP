package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.OtpPurpose;
import com.merabp.healthcare.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    // Find the latest unused, unexpired OTP for an email + purpose
    Optional<OtpVerification> findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
            String email, OtpPurpose purpose, LocalDateTime now);

    // Clean up all previous OTPs for an email + purpose before issuing a new one
    // Prevents stale OTPs accumulating in the table
    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.email = :email AND o.purpose = :purpose")
    void deleteAllByEmailAndPurpose(@Param("email") String email,
                                    @Param("purpose") OtpPurpose purpose);

    // Scheduled cleanup — delete all expired OTPs (run via @Scheduled)
    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.expiresAt < :now")
    void deleteAllExpired(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.email = :email")
    void deleteAllByEmail(@Param("email") String email);
}