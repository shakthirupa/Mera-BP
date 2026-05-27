package com.merabp.healthcare.repository;
import org.springframework.data.jpa.repository.Modifying;
import com.merabp.healthcare.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    // Single reminder — checks medication ownership via patientId
    @Query("""
            SELECT r FROM Reminder r
            WHERE r.id = :id
              AND r.medication.id = :medicationId
            """)
    Optional<Reminder> findByIdAndMedicationId(
            @Param("id") Long id,
            @Param("medicationId") Long medicationId);

    // All reminders for a medication ordered by time
    @Query("""
            SELECT r FROM Reminder r
            WHERE r.medication.id = :medicationId
            ORDER BY r.reminderTime ASC
            """)
    List<Reminder> findAllByMedicationIdOrderByReminderTimeAsc(
            @Param("medicationId") Long medicationId);

    // Duplicate time check — used before add/update
    boolean existsByMedicationIdAndReminderTime(Long medicationId, LocalTime reminderTime);

    // All reminders for a patient across all medications
    @Query("""
            SELECT r FROM Reminder r
            WHERE r.medication.patient.id = :patientId
            ORDER BY r.reminderTime ASC
            """)
    List<Reminder> findAllByPatientIdOrderByReminderTimeAsc(
            @Param("patientId") Long patientId);

    @Modifying
    @Query("""
            DELETE FROM Reminder r
            WHERE r.medication.patient.id = :patientId
            """)
    void deleteAllByPatientId(@Param("patientId") Long patientId);

    // Duplicate time check on update — exclude current reminder
    @Query("""
            SELECT COUNT(r) > 0 FROM Reminder r
            WHERE r.medication.id = :medicationId
              AND r.reminderTime = :reminderTime
              AND r.id <> :id
            """)
    boolean existsByMedicationIdAndReminderTimeAndIdNot(
            @Param("medicationId") Long medicationId,
            @Param("reminderTime") LocalTime reminderTime,
            @Param("id") Long id);
}