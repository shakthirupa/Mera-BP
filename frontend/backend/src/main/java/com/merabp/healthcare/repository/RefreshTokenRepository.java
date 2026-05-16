package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.patient.id = :patientId")
    void revokeAllByPatientId(@Param("patientId") Long patientId);


    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Transactional
    @Query("""
        UPDATE RefreshToken rt
        SET rt.used = true
        WHERE rt.id = :id AND rt.used = false
    """)
    int markUsedIfNotUsed(Long id);

    @Modifying
    @Transactional
    @Query("""
        UPDATE RefreshToken rt
        SET rt.revoked = true
        WHERE rt.familyId = :familyId
    """)
    void revokeAllByFamilyId(String familyId);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM RefreshToken rt
        WHERE rt.expiresAt < :now OR rt.revoked = true
    """)
    void deleteAllExpiredOrRevoked(LocalDateTime now);
}