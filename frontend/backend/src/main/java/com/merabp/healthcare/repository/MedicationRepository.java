package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MedicationRepository extends JpaRepository<Medication, Long> {


    Optional<Medication> findByIdAndPatientId(
            @Param("id") Long id,
            @Param("patientId") Long patientId);

    List<Medication> findAllByPatientIdOrderByCreatedAtDesc(
            @Param("patientId") Long patientId);
}