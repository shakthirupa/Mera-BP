import { METRIC_CONFIG, MetricConfig, MetricKey } from "@/src/config/metrics";
import { API } from "@/src/constants/api";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LabRecord {
  id: string;
  metricKey: MetricKey;  // so each row knows which config to use
  value: string;
  date: string;
  time: string;
  notes?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LAB_METRIC_KEYS: MetricKey[] = [
  "HBA1C",
  "BLOOD_GLUCOSE_FASTING",
  "BLOOD_GLUCOSE_POST_PRANDIAL",
];

const LAB_ICONS: Record<string, { name: string; color: string; bg: string }> = {
  HBA1C:                       { name: "water", color: "#534AB7", bg: "#EEEDFE" },
  BLOOD_GLUCOSE_FASTING:        { name: "water", color: "#185FA5", bg: "#E6F1FB" },
  BLOOD_GLUCOSE_POST_PRANDIAL: { name: "water", color: "#993C1D", bg: "#FAECE7" },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LabReportsScreen() {
  const router = useRouter();

  // flat list of all records across all three metrics, sorted by date desc
  const [allRecords, setAllRecords] = useState<LabRecord[]>([]);

  // empty set = no filter active = show all
  const [activeFilters, setActiveFilters] = useState<Set<MetricKey>>(new Set());

  const toggleFilter = (key: MetricKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // if nothing selected show everything, otherwise show only selected
  const filteredRecords = activeFilters.size === 0
    ? allRecords
    : allRecords.filter((r) => activeFilters.has(r.metricKey));

  const [activeConfig, setActiveConfig] = useState<MetricConfig | null>(null);
  const [activeKey,    setActiveKey]    = useState<MetricKey | null>(null);

  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<LabRecord | null>(null);

  const emptyForm = (config: MetricConfig) =>
    Object.fromEntries(config.inputs.map((i) => [i.field, ""])) as Record<string, string>;

  const [formValues,     setFormValues]     = useState<Record<string, string>>({});
  const [formNotes,      setFormNotes]      = useState("");
  const [selectedDate,   setSelectedDate]   = useState(new Date());
  const [selectedTime,   setSelectedTime]   = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => { loadAllRecords(); }, []);

  const loadAllRecords = async () => {
    try {
      const token = await getAccessToken();
      const results = await Promise.all(
        LAB_METRIC_KEYS.map(async (key) => {
          const config = METRIC_CONFIG[key];
          const url = `${API.OBSERVATIONS}?code=${config.code}${
            config.context ? `&context=${config.context}` : ""
          }`;
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || `Failed to load ${config.label}`);

          return data.map((obs: any): LabRecord => ({
            id:        String(obs.id),
            metricKey: key,
            value:     config.formatValue(obs.value1, obs.value2),
            date:      obs.effectiveDateTime.split("T")[0],
            time:      obs.effectiveDateTime.split("T")[1]?.slice(0, 5) ?? "",
            notes:     obs.notes ?? "",
          }));
        })
      );

      // merge all three lists and sort newest first
      const flat = results.flat().sort((a, b) => {
        const dt = (r: LabRecord) => `${r.date}T${r.time}`;
        return dt(b).localeCompare(dt(a));
      });
      setAllRecords(flat);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load lab reports.");
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDateDisplay = (d: Date) =>
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  const formatTimeDisplay = (t: Date) =>
    `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  const buildEffectiveDateTime = () => {
    const d = selectedDate, t = selectedTime;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}:00`;
  };
  const isFormValid = () =>
    activeConfig?.inputs.every((i) => formValues[i.field]?.trim() !== "") ?? false;
  const resetForm = (config?: MetricConfig) => {
    setFormValues(config ? emptyForm(config) : {});
    setFormNotes("");
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  // ── Add ────────────────────────────────────────────────────────────────────

  const handleOpenAdd = (key: MetricKey) => {
    const config = METRIC_CONFIG[key];
    setActiveKey(key);
    setActiveConfig(config);
    resetForm(config);
    setShowAddModal(true);
  };

  const handleAdd = async () => {
    if (!activeConfig || !activeKey || !isFormValid()) return;
    const body: Record<string, any> = {
      code:              activeConfig.code,
      value1:            parseFloat(formValues["value1"]),
      effectiveDateTime: buildEffectiveDateTime(),
      notes:             formNotes.trim() || null,
    };
    if (activeConfig.context)               body.context = activeConfig.context;
    if (formValues["value2"] !== undefined)  body.value2  = parseFloat(formValues["value2"]);

    try {
      const token    = await getAccessToken();
      const response = await fetch(API.OBSERVATIONS, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add record.");
      setShowAddModal(false);
      resetForm();
      loadAllRecords();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  // ── Detail ─────────────────────────────────────────────────────────────────

  const handleRowPress = (record: LabRecord) => {
    setActiveKey(record.metricKey);
    setActiveConfig(METRIC_CONFIG[record.metricKey]);
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  // ── Edit ───────────────────────────────────────────────────────────────────

  const openEditModal = () => {
    if (!selectedRecord || !activeConfig) return;
    const parsed = activeConfig.parseValue(selectedRecord.value);
    setFormValues({ value1: parsed.value1, ...(parsed.value2 ? { value2: parsed.value2 } : {}) });
    setFormNotes(selectedRecord.notes ?? "");
    const [year, month, day] = selectedRecord.date.split("-").map(Number);
    const [hour, minute]     = selectedRecord.time.split(":").map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedTime(new Date(year, month - 1, day, hour, minute));
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!selectedRecord || !activeConfig || !isFormValid()) return;
    const body: Record<string, any> = {
      code:              activeConfig.code,
      value1:            parseFloat(formValues["value1"]),
      effectiveDateTime: buildEffectiveDateTime(),
      notes:             formNotes.trim() || null,
    };
    if (activeConfig.context)               body.context = activeConfig.context;
    if (formValues["value2"] !== undefined)  body.value2  = parseFloat(formValues["value2"]);

    try {
      const token    = await getAccessToken();
      const response = await fetch(`${API.OBSERVATIONS}/${selectedRecord.id}`, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update record.");
      setShowEditModal(false);
      resetForm();
      setSelectedRecord(null);
      loadAllRecords();
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
              loadAllRecords();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Something went wrong.");
            }
          },
        },
      ]
    );
  };

  // ── Form JSX ──────────────────────────────────────────────────────────────

  const renderForm = () => {
    if (!activeConfig) return null;
    return (
      <View style={styles.inputSection}>
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

        {activeConfig.inputs.map((input) => (
          <View key={input.field}>
            <Text style={styles.inputLabel}>
              {input.label} <Text style={styles.unitHint}>({input.unit})</Text>
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

        <Text style={styles.inputLabel}>
          Notes <Text style={styles.unitHint}>(optional)</Text>
        </Text>
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
            value={selectedDate} mode="date" display="default" maximumDate={new Date()}
            onChange={(_, d) => { setShowDatePicker(false); if (d) setSelectedDate(d); }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime} mode="time" display="default"
            onChange={(_, t) => { setShowTimePicker(false); if (t) setSelectedTime(t); }}
          />
        )}
      </View>
    );
  };

  // ── Form modal (Add / Edit) ───────────────────────────────────────────────

  const renderFormModal = ({
    visible, title, onClose, onSubmit, submitLabel,
  }: {
    visible: boolean; title: string; onClose: () => void;
    onSubmit: () => void; submitLabel: string;
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
      source={require("@/assets/images/lab.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
    >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lab Results</Text>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Three category buttons ─────────────────────────────────── */}
        <View style={styles.categorySection}>
          {LAB_METRIC_KEYS.map((key) => {
            const config = METRIC_CONFIG[key];
            const icon   = LAB_ICONS[key];
            return (
              <TouchableOpacity
                key={key}
                style={styles.categoryCard}
                onPress={() => handleOpenAdd(key)}
                activeOpacity={0.75}
              >
                <View style={[styles.categoryIconWrap, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name as any} size={20} color={icon.color} />
                </View>
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{config.label}</Text>
                  <Text style={styles.categoryDesc}>
                    {key === "HBA1C"
                      ? "Diabetes monitoring test"
                      : key === "BLOOD_GLUCOSE_FASTING"
                      ? "Blood glucose after fasting"
                      : "Blood glucose after meals"}
                  </Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color="#2563EB" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Filter tabs ───────────────────────────────────────────── */}
        <Text style={styles.tableTitle}>Records</Text>

        <View style={styles.filterRow}>
          {LAB_METRIC_KEYS.map((key) => {
            const icon     = LAB_ICONS[key];
            const isActive = activeFilters.has(key);
            const label    = key === "HBA1C" ? "HbA1c"
                           : key === "BLOOD_GLUCOSE_FASTING" ? "Fasting"
                           : "Post Meal";
            return (
              <TouchableOpacity
                key={key}
                style={[styles.filterTab, isActive && { backgroundColor: icon.color, borderColor: icon.color }]}
                onPress={() => toggleFilter(key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tableContainer}>
          {filteredRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>No entries yet</Text>
            </View>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.thCell, styles.colTest]}>Test</Text>
                <Text style={[styles.thCell, styles.colValue]}>Value</Text>
                <Text style={[styles.thCell, styles.colDate]}>Date</Text>
                <Text style={[styles.thCell, styles.colTime]}>Time</Text>
              </View>

              {filteredRecords.map((record, index) => {
                const config = METRIC_CONFIG[record.metricKey];
                const icon   = LAB_ICONS[record.metricKey];
                return (
                  <TouchableOpacity
                    key={record.id}
                    style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                    onPress={() => handleRowPress(record)}
                    activeOpacity={0.7}
                  >
                    {/* Test name with color dot */}
                    <View style={[styles.colTest, styles.testCell]}>
                      <Text style={styles.testName} numberOfLines={2}>{config.label}</Text>
                    </View>
                    {/* Value colored by status */}
                    <Text style={[styles.tdCell, styles.colValue, styles.valueCell,
                      { color: config.getStatusColor(record.value) }]}>
                      {record.value}
                    </Text>
                    <Text style={[styles.tdCell, styles.colDate]}>{record.date}</Text>
                    <Text style={[styles.tdCell, styles.colTime]}>{record.time}</Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>

      </ScrollView>

      {/* ── ADD MODAL ─────────────────────────────────────────────── */}
      {renderFormModal({
        visible:     showAddModal,
        title:       `Add ${activeConfig?.label ?? ""}`,
        onClose:     () => { setShowAddModal(false); resetForm(); },
        onSubmit:    handleAdd,
        submitLabel: "Save",
      })}

      {/* ── DETAIL MODAL ──────────────────────────────────────────── */}
      <Modal visible={showDetailModal} transparent animationType="fade" onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRecord && activeConfig && (
              <>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailMetricLabel}>{activeConfig.label}</Text>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Large value + status badge — only shown here */}
                <View style={styles.detailValueRow}>
                  <Text style={[styles.detailValue, { color: activeConfig.getStatusColor(selectedRecord.value) }]}>
                    {selectedRecord.value}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${activeConfig.getStatusColor(selectedRecord.value)}20` }]}>
                    <Text style={[styles.statusText, { color: activeConfig.getStatusColor(selectedRecord.value) }]}>
                      {activeConfig.getStatusLabel(selectedRecord.value)}
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

      {/* ── EDIT MODAL ────────────────────────────────────────────── */}
      {renderFormModal({
        visible:     showEditModal,
        title:       `Edit ${activeConfig?.label ?? ""}`,
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

  // Category buttons
  categorySection:  { marginTop: 10 },
  sectionLabel:     { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 16 },
  categoryCard:     { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  categoryIconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  categoryContent:  { flex: 1 },
  categoryTitle:    { fontSize: 15, fontWeight: "600", color: "#111827", marginBottom: 2 },
  categoryDesc:     { fontSize: 12, color: "#6B7280" },

  // Filter tabs
  filterRow:        { flexDirection: "row", gap: 8, marginBottom: 14 },
  filterTab:        { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "rgba(255,255,255,0.9)" },
  filterDot:        { width: 7, height: 7, borderRadius: 4 },
  filterTabText:    { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  filterTabTextActive: { color: "#fff" },

  // Combined table
  tableTitle:       { fontSize: 18, fontWeight: "600", color: "#111827", marginTop: 24, marginBottom: 12 },
  tableContainer:   { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  tableHeader:      { flexDirection: "row", backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 8 },
  thCell:           { color: "#FFFFFF", fontSize: 12, fontWeight: "700", textAlign: "center" },
  tableRow:         { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", alignItems: "center" },
  evenRow:          { backgroundColor: "#F9FAFB" },
  oddRow:           { backgroundColor: "#FFFFFF" },
  tdCell:           { fontSize: 12, color: "#374151", textAlign: "center" },
  colTest:          { flex: 2.5 },
  colValue:         { flex: 1.8 },
  colDate:          { flex: 2.2 },
  colTime:          { flex: 1.5 },
  testCell:         { flexDirection: "row"},
  dot:              { width: 7, height: 7, borderRadius: 4 },
  testName:         { fontSize: 11, color: "#374151", flex: 1, fontWeight: "500" },
  valueCell:        { fontWeight: "700", fontSize: 13 },
  emptyState:       { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyText:        { fontSize: 14, color: "#9CA3AF" },

  // Modals — shared
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
  detailHeader:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  detailMetricLabel:  { fontSize: 12, fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  detailValueRow:     { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  detailValue:        { fontSize: 32, fontWeight: "700" },
  statusBadge:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText:         { fontSize: 12, fontWeight: "600" },
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
