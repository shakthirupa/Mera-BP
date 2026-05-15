import { API } from "@/src/constants/api";
import { METRIC_CONFIG, MetricKey } from "@/src/config/metrics";
import { COLORS } from "@/src/constants/theme";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthRecord {
  id: string;
  value: string;   // formatted display string, e.g. "120/80" or "72 bpm"
  date: string;    // ISO date "YYYY-MM-DD"
  time: string;    // "HH:MM"
  notes?: string;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HealthHistoryScreen() {
  const router = useRouter();
  const { metricKey } = useLocalSearchParams<{ metricKey: MetricKey }>();
  const config = METRIC_CONFIG[metricKey];

  // ── State ──────────────────────────────────────────────────────────────────

  const [records, setRecords]               = useState<HealthRecord[]>([]);
  const [loading, setLoading]               = useState(false);

  // modal visibility
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);

  // the record the user tapped
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  // shared form state — keyed by field id so it works for any metric
  const emptyForm = () =>
    Object.fromEntries(config.inputs.map((i) => [i.field, ""])) as Record<string, string>;

  const [formValues,    setFormValues]    = useState<Record<string, string>>(emptyForm());
  const [formNotes,     setFormNotes]     = useState("");
  const [selectedDate,  setSelectedDate]  = useState(new Date());
  const [selectedTime,  setSelectedTime]  = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ── Data loading ───────────────────────────────────────────────────────────

  useEffect(() => { loadRecords(); }, [metricKey]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const token    = await getAccessToken();
      const response = await fetch(`${API.OBSERVATIONS}?code=${config.code}`, {
        method:  "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch records.");

      const mapped: HealthRecord[] = data.map((obs: any) => ({
        id:    String(obs.id),
        value: config.formatValue(obs.value1, obs.value2),
        date:  obs.effectiveDateTime.split("T")[0],
        time:  obs.effectiveDateTime.split("T")[1]?.slice(0, 5) ?? "",
        notes: obs.notes ?? "",
      }));
      setRecords(mapped);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormValues(emptyForm());
    setFormNotes("");
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  const isFormValid = () =>
    config.inputs.every((i) => formValues[i.field]?.trim() !== "");

  const buildEffectiveDateTime = () => {
    const d = selectedDate;
    const t = selectedTime;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}:00`;
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const formatDateDisplay = (d: Date) =>
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

  const formatTimeDisplay = (t: Date) =>
    `${pad(t.getHours())}:${pad(t.getMinutes())}`;

  // ── Add ────────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const body: Record<string, any> = {
      code:              config.code,
      value1:            parseFloat(formValues["value1"]),
      effectiveDateTime: buildEffectiveDateTime(),
      notes:             formNotes.trim() || null,
    };
    if (formValues["value2"] !== undefined) {
      body.value2 = parseFloat(formValues["value2"]);
    }

    try {
      const token    = await getAccessToken();
      const response = await fetch(API.OBSERVATIONS, {
        method:  "POST",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add record.");

      setShowAddModal(false);
      resetForm();
      loadRecords();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  // ── Row tap → detail modal ─────────────────────────────────────────────────

  const handleRowPress = (record: HealthRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  // ── Open edit modal pre-filled from selected record ────────────────────────

  const openEditModal = () => {
    if (!selectedRecord) return;
    const parsed = config.parseValue(selectedRecord.value);
    setFormValues({ value1: parsed.value1, ...(parsed.value2 ? { value2: parsed.value2 } : {}) });
    setFormNotes(selectedRecord.notes ?? "");

    const [year, month, day] = selectedRecord.date.split("-").map(Number);
    const [hour, minute]     = selectedRecord.time.split(":").map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedTime(new Date(year, month - 1, day, hour, minute));

    setShowDetailModal(false);
    setShowEditModal(true);
  };

  // ── Edit ───────────────────────────────────────────────────────────────────

  const handleEdit = async () => {
    if (!selectedRecord || !isFormValid()) return;

    const body: Record<string, any> = {
      code:              config.code,
      value1:            parseFloat(formValues["value1"]),
      effectiveDateTime: buildEffectiveDateTime(),
      notes:             formNotes.trim() || null,
    };
    if (formValues["value2"] !== undefined) {
      body.value2 = parseFloat(formValues["value2"]);
    }

    try {
      const token    = await getAccessToken();
      const response = await fetch(`${API.OBSERVATIONS}/${selectedRecord.id}`, {
        method:  "PUT",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update record.");

      setShowEditModal(false);
      resetForm();
      setSelectedRecord(null);
      loadRecords();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = () => {
    if (!selectedRecord) return;
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this reading? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token    = await getAccessToken();
              const response = await fetch(`${API.OBSERVATIONS}/${selectedRecord.id}`, {
                method:  "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete record.");
              }
              setShowDetailModal(false);
              setSelectedRecord(null);
              loadRecords();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Something went wrong.");
            }
          },
        },
      ]
    );
  };

  // ── Shared form JSX ───────────────────────────────────────────────────────

  const renderForm = () => (
    <View style={styles.inputSection}>
      {/* Date & Time */}
      <View style={styles.dateTimeSection}>
        <Text style={styles.inputLabel}>Date & Time</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={18} color="#2563EB" />
            <Text style={styles.dateTimeText}>{formatDateDisplay(selectedDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={18} color="#2563EB" />
            <Text style={styles.dateTimeText}>{formatTimeDisplay(selectedTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic inputs from config */}
      {config.inputs.map((input) => (
        <View key={input.field}>
          <Text style={styles.inputLabel}>
            {input.label}{" "}
            <Text style={styles.unitHint}>({input.unit})</Text>
          </Text>
          <TextInput
            style={styles.modalInput}
            value={formValues[input.field] ?? ""}
            onChangeText={(text) =>
              setFormValues((prev) => ({ ...prev, [input.field]: text }))
            }
            placeholder={input.placeholder}
            placeholderTextColor="#b6c0cd"
            keyboardType="numeric"
          />
        </View>
      ))}

      {/* Notes */}
      <Text style={styles.inputLabel}>Notes <Text style={styles.unitHint}>(optional)</Text></Text>
      <TextInput
        style={[styles.modalInput, styles.notesInput]}
        value={formNotes}
        onChangeText={setFormNotes}
        placeholder="Any relevant context..."
        placeholderTextColor="#b6c0cd"
        multiline
        numberOfLines={3}
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_, date) => { setShowDatePicker(false); if (date) setSelectedDate(date); }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(_, time) => { setShowTimePicker(false); if (time) setSelectedTime(time); }}
        />
      )}
    </View>
  );

  // ── Shared Add/Edit modal ─────────────────────────────────────────────────
  // KeyboardAwareScrollView auto-scrolls the focused input above the keyboard.
  // The modal itself stays fixed — only the form content inside scrolls.

  const renderFormModal = ({
    visible,
    title,
    onClose,
    onSubmit,
    submitLabel,
  }: {
    visible: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    submitLabel: string;
  }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.modalTitle}>{title}</Text>

          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={20}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {renderForm()}
          </KeyboardAwareScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !isFormValid() && styles.disabledBtn]}
              onPress={onSubmit}
              disabled={!isFormValid()}
            >
              <Text style={styles.saveText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ImageBackground
      source={require("@/assets/images/bb.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.label}</Text>
        <View />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Latest Reading</Text>
          {records.length > 0 && (
            <>
              <Text style={[styles.summaryValue, { color: config.getStatusColor(records[0].value) }]}>
                {records[0].value}
              </Text>
              <Text style={styles.summaryDate}>
                {records[0].date} at {records[0].time}
              </Text>
              {records[0].notes ? (
                <Text style={styles.summaryNotes}>{records[0].notes}</Text>
              ) : null}
            </>
          )}
        </View>

        {/* Records Table */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>All Records</Text>

          {records.length > 0 ? (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.dateColumn]}>Date</Text>
                <Text style={[styles.headerCell, styles.valueColumn]}>Value</Text>
                <Text style={[styles.headerCell, styles.timeColumn]}>Time</Text>
                <Text style={[styles.headerCell, styles.statusColumn]}>Status</Text>
              </View>

              {records.map((record, index) => (
                <TouchableOpacity
                  key={record.id}
                  style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                  onPress={() => handleRowPress(record)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cell, styles.dateColumn]}>{record.date}</Text>
                  <Text style={[styles.cell, styles.valueColumn, styles.valueText]}>
                    {record.value}
                  </Text>
                  <Text style={[styles.cell, styles.timeColumn]}>{record.time}</Text>
                  <View style={[styles.statusColumn]}>
                    <View style={[styles.statusBadge, { backgroundColor: `${config.getStatusColor(record.value)}20` }]}>
                      <Text style={[styles.statusText, { color: config.getStatusColor(record.value) }]}>
                        {config.getStatusLabel(record.value)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Records Yet</Text>
              <Text style={styles.emptyDesc}>
                Start tracking your {config.label.toLowerCase()} by adding your first reading.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => { resetForm(); setShowAddModal(true); }}
        style={styles.fab}
      >
        <Ionicons name="add" color="#fff" size={40} />
      </Pressable>

      {/* ── ADD MODAL ───────────────────────────────────────────────────── */}
      {renderFormModal({
        visible:     showAddModal,
        title:       `Add ${config.label}`,
        onClose:     () => { setShowAddModal(false); resetForm(); },
        onSubmit:    handleAdd,
        submitLabel: "Save",
      })}

      {/* ── DETAIL MODAL ────────────────────────────────────────────────── */}
      <Modal visible={showDetailModal} transparent animationType="fade" onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRecord && (
              <>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailMetricLabel}>{config.label}</Text>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailValueRow}>
                  <Text style={[styles.detailValue, { color: config.getStatusColor(selectedRecord.value) }]}>
                    {selectedRecord.value}
                  </Text>
                  <View style={[styles.statusBadge, styles.detailStatusBadge, { backgroundColor: `${config.getStatusColor(selectedRecord.value)}20` }]}>
                    <Text style={[styles.statusText, { color: config.getStatusColor(selectedRecord.value) }]}>
                      {config.getStatusLabel(selectedRecord.value)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailMeta}>
                  <View style={styles.detailMetaRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailMetaText}>{selectedRecord.date}</Text>
                  </View>
                  <View style={styles.detailMetaRow}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailMetaText}>{selectedRecord.time}</Text>
                  </View>
                </View>

                {selectedRecord.notes ? (
                  <View style={styles.detailNotesBox}>
                    <Text style={styles.detailNotesLabel}>Notes</Text>
                    <Text style={styles.detailNotesText}>{selectedRecord.notes}</Text>
                  </View>
                ) : (
                  <Text style={styles.noNotesText}>No notes added.</Text>
                )}

                <View style={styles.detailActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
                    <Ionicons name="pencil-outline" size={18} color="#2563EB" />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── EDIT MODAL ──────────────────────────────────────────────────── */}
      {renderFormModal({
        visible:     showEditModal,
        title:       `Edit ${config.label}`,
        onClose:     () => { setShowEditModal(false); resetForm(); },
        onSubmit:    handleEdit,
        submitLabel: "Update",
      })}

    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backgroundImage:  { flex: 1 },
  container:        { flex: 1, backgroundColor: "transparent", padding: 20 },
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 40, paddingVertical: 14 },
  headerTitle:      { fontSize: 20, fontWeight: "600", color: "#0F172A" },

  // Summary
  summaryCard:      { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 20, marginBottom: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  summaryTitle:     { fontSize: 16, fontWeight: "600", color: "#6B7280", marginBottom: 8 },
  summaryValue:     { fontSize: 32, fontWeight: "700", marginBottom: 4 },
  summaryDate:      { fontSize: 14, color: "#9CA3AF" },
  summaryNotes:     { fontSize: 13, color: "#6B7280", marginTop: 6, fontStyle: "italic", textAlign: "center" },

  // Table
  recordsSection:   { marginTop: 10 },
  sectionTitle:     { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 16 },
  tableContainer:   { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  tableHeader:      { flexDirection: "row", backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 8 },
  headerCell:       { fontSize: 12, fontWeight: "700", color: "#FFFFFF", textAlign: "center" },
  tableRow:         { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", alignItems: "center" },
  evenRow:          { backgroundColor: "#F9FAFB" },
  oddRow:           { backgroundColor: "#FFFFFF" },
  cell:             { fontSize: 12, color: "#111827", textAlign: "center" },
  dateColumn:       { flex: 2.5 },
  valueColumn:      { flex: 2 },
  timeColumn:       { flex: 2 },
  statusColumn:     { flex: 1.5 },
  valueText:        { fontWeight: "600", fontSize: 13 },
  statusBadge:      { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: "center" },
  statusText:       { fontSize: 10, fontWeight: "600", textAlign: "center" },

  // Empty
  emptyState:       { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 40, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  emptyTitle:       { fontSize: 18, fontWeight: "600", color: "#111827", marginTop: 16, marginBottom: 8 },
  emptyDesc:        { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20 },

  // FAB
  fab:              { backgroundColor: COLORS.primary, height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", position: "absolute", bottom: 50, right: 50 },

  // Modals - shared
  modalOverlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent:     { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, width: "85%", maxWidth: 400, maxHeight: "85%" },
  modalTitle:       { fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 24 },
  modalButtons:     { flexDirection: "row", gap: 12, paddingTop: 12 },
  cancelBtn:        { flex: 1, backgroundColor: "#F3F4F6", padding: 16, borderRadius: 12, alignItems: "center" },
  cancelText:       { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  saveBtn:          { flex: 1, backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center" },
  saveText:         { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  disabledBtn:      { opacity: 0.45 },

  // Form
  inputSection:     { marginBottom: 8 },
  inputLabel:       { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8, marginTop: 12 },
  unitHint:         { fontWeight: "400", color: "#9CA3AF", fontSize: 14 },
  modalInput:       { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: "#F9FAFB" },
  notesInput:       { height: 80, textAlignVertical: "top" },
  dateTimeSection:  { marginBottom: 4 },
  dateTimeRow:      { flexDirection: "row", gap: 12, marginTop: 8 },
  dateTimeBtn:      { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, padding: 14, backgroundColor: "#F9FAFB" },
  dateTimeText:     { fontSize: 15, color: "#111827", fontWeight: "500" },

  // Detail modal
  detailHeader:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  detailMetricLabel:  { fontSize: 12, fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  detailValueRow:     { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  detailValue:        { fontSize: 32, fontWeight: "700" },
  detailStatusBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  detailMeta:         { gap: 8, marginBottom: 16 },
  detailMetaRow:      { flexDirection: "row", alignItems: "center", gap: 8 },
  detailMetaText:     { fontSize: 14, color: "#374151" },
  detailNotesBox:     { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 20 },
  detailNotesLabel:   { fontSize: 12, fontWeight: "600", color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  detailNotesText:    { fontSize: 14, color: "#374151", lineHeight: 20 },
  noNotesText:        { fontSize: 14, color: "#9CA3AF", fontStyle: "italic", marginBottom: 20 },
  detailActions:      { flexDirection: "row", gap: 12 },
  editBtn:            { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#EFF6FF", padding: 14, borderRadius: 12 },
  editBtnText:        { fontSize: 15, fontWeight: "600", color: "#2563EB" },
  deleteBtn:          { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FEF2F2", padding: 14, borderRadius: 12 },
  deleteBtnText:      { fontSize: 15, fontWeight: "600", color: "#EF4444" },
});
