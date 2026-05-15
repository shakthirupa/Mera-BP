package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // For admin/doctor listings — only verified patients
    Page<Patient> findAllByDeletedFalse(Pageable pageable);

    Optional<Patient> findByIdAndDeletedFalse(Long id);

    Optional<Patient> findByEmailAndDeletedFalse(String email);

    Optional<Patient> findByPhoneAndDeletedFalse(String phone);

    Optional<Patient> findByGoogleIdAndDeletedFalse(String googleId);

    boolean existsByEmailAndDeletedFalse(String email);

    boolean existsByPhoneAndDeletedFalse(String phone);

    @Query("SELECT COUNT(p) > 0 FROM Patient p WHERE p.email = :email AND p.id <> :id AND p.deleted = false")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);

    @Query("SELECT COUNT(p) > 0 FROM Patient p WHERE p.phone = :phone AND p.id <> :id AND p.deleted = false")
    boolean existsByPhoneAndIdNot(@Param("phone") String phone, @Param("id") Long id);

}