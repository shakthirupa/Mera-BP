package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

    Optional<Medication> findByIdAndPatientId(
            @Param("id") Long id,
            @Param("patientId") Long patientId);

    List<Medication> findAllByPatientIdOrderByCreatedAtDesc(
            @Param("patientId") Long patientId);

    @Modifying
    @Query("DELETE FROM Medication m WHERE m.patient.id = :patientId")
    void deleteAllByPatientId(@Param("patientId") Long patientId);
}