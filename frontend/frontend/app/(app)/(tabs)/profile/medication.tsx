import { API } from "@/src/constants/api";
import { COLORS } from "@/src/constants/theme";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

interface Medication {
  id: number;
  name: string;
  purpose?: string;
  instructions?: string;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MedicationScreen() {
  const router = useRouter();

  const [medications,    setMedications]    = useState<Medication[]>([]);
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [showDetailModal,setShowDetailModal]= useState(false);
  const [showEditModal,  setShowEditModal]  = useState(false);
  const [selected,       setSelected]       = useState<Medication | null>(null);

  // form state
  const [name,         setName]         = useState("");
  const [purpose,      setPurpose]      = useState("");
  const [instructions, setInstructions] = useState("");

  const isFormValid = () => name.trim() !== "";

  const resetForm = () => {
    setName("");
    setPurpose("");
    setInstructions("");
  };

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => { loadMedications(); }, []);

  const loadMedications = async () => {
    try {
      const token    = await getAccessToken();
      const response = await fetch(API.MEDICATIONS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch medications");
      setMedications(await response.json());
    } catch {
      Alert.alert("Error", "Failed to load medications");
    }
  };

  // ── Add ────────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!isFormValid()) return;
    try {
      const token    = await getAccessToken();
      const response = await fetch(API.MEDICATIONS, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ name, purpose, instructions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add medication");
      setShowAddModal(false);
      resetForm();
      loadMedications();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // ── Row tap → detail modal ─────────────────────────────────────────────────

  const handleRowPress = (medication: Medication) => {
    setSelected(medication);
    setShowDetailModal(true);
  };

  // ── Open edit modal ────────────────────────────────────────────────────────

  const openEditModal = () => {
    if (!selected) return;
    setName(selected.name);
    setPurpose(selected.purpose ?? "");
    setInstructions(selected.instructions ?? "");
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  // ── Edit ───────────────────────────────────────────────────────────────────

  const handleEdit = async () => {
    if (!selected || !isFormValid()) return;
    try {
      const token    = await getAccessToken();
      const response = await fetch(`${API.MEDICATIONS}/${selected.id}`, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ name, purpose, instructions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update medication");
      setShowEditModal(false);
      resetForm();
      setSelected(null);
      loadMedications();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = () => {
    if (!selected) return;
    Alert.alert(
      "Delete Medication",
      `Are you sure you want to delete "${selected.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              const token    = await getAccessToken();
              const response = await fetch(`${API.MEDICATIONS}/${selected.id}`, {
                method:  "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!response.ok) throw new Error("Failed to delete medication");
              setShowDetailModal(false);
              setSelected(null);
              loadMedications();
            } catch {
              Alert.alert("Error", "Failed to delete medication");
            }
          },
        },
      ]
    );
  };

  // ── Shared form JSX ───────────────────────────────────────────────────────

  const renderForm = () => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>
        Medication Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Metformin"
        placeholderTextColor="#b6c0cd"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.inputLabel}>
        Purpose <Text style={styles.optional}>(optional)</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Blood sugar control"
        placeholderTextColor="#b6c0cd"
        value={purpose}
        onChangeText={setPurpose}
      />

      <Text style={styles.inputLabel}>
        Instructions <Text style={styles.optional}>(optional)</Text>
      </Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="e.g. Take one tablet after meals"
        placeholderTextColor="#b6c0cd"
        value={instructions}
        onChangeText={setInstructions}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  // ── Shared form modal ─────────────────────────────────────────────────────

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
      source={require("@/assets/images/medication.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.6 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.tableContainer}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.nameColumn]}>Medication List</Text>
          </View>

          {/* Rows */}
          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medkit-outline" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>No medications added yet</Text>
            </View>
          ) : (
            medications.map((medication, index) => (
              <TouchableOpacity
                key={medication.id}
                style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                onPress={() => handleRowPress(medication)}
                activeOpacity={0.7}
              >
                <Text style={[styles.cell, styles.snoColumn]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.nameColumn, styles.nameText]}>
                  {medication.name}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))
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

      {/* ── ADD MODAL ─────────────────────────────────────────────── */}
      {renderFormModal({
        visible:     showAddModal,
        title:       "Add Medication",
        onClose:     () => { setShowAddModal(false); resetForm(); },
        onSubmit:    handleAdd,
        submitLabel: "Save",
      })}

      {/* ── DETAIL MODAL ──────────────────────────────────────────── */}
      <Modal visible={showDetailModal} transparent animationType="fade" onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                {/* Header row */}
                <View style={styles.detailHeader}>
                  <Text style={styles.detailName}>{selected.name}</Text>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Purpose */}
                {selected.purpose ? (
                  <View style={styles.detailField}>
                    <Text style={styles.detailFieldLabel}>Purpose</Text>
                    <Text style={styles.detailFieldValue}>{selected.purpose}</Text>
                  </View>
                ) : null}

                {/* Instructions */}
                {selected.instructions ? (
                  <View style={styles.detailField}>
                    <Text style={styles.detailFieldLabel}>Instructions</Text>
                    <Text style={styles.detailFieldValue}>{selected.instructions}</Text>
                  </View>
                ) : null}

                {!selected.purpose && !selected.instructions && (
                  <Text style={styles.noDetailsText}>No additional details added.</Text>
                )}

                {/* Go to reminders */}
                <TouchableOpacity
                  style={styles.remindersBtn}
                  onPress={() => {
                    setShowDetailModal(false);
                    router.push({
                      pathname: "/profile/medicationDetail",
                      params: { medicationData: JSON.stringify(selected) },
                    });
                  }}
                >
                  <Ionicons name="alarm-outline" size={18} color="#2563EB" />
                  <Text style={styles.remindersBtnText}>View Reminders</Text>
                  <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                </TouchableOpacity>

                {/* Edit / Delete */}
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
        title:       "Edit Medication",
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
  container:        { flex: 1, backgroundColor: "transparent", padding: 20, paddingTop: 0 },
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 40, paddingVertical: 14 },
  headerTitle:      { fontSize: 20, fontWeight: "600", color: "#0F172A" },

  // Table
  tableContainer:   { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginTop:20 },
  tableHeader:      { flexDirection: "row", backgroundColor: "#2563EB", paddingVertical: 14, paddingHorizontal: 12, alignItems: "center" },
  headerCell:       { fontSize: 13, fontWeight: "700", color: "#FFFFFF", textAlign: "center" },
  tableRow:         { flexDirection: "row", paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", alignItems: "center" },
  evenRow:          { backgroundColor: "#F9FAFB" },
  oddRow:           { backgroundColor: "#FFFFFF" },
  cell:             { fontSize: 14, color: "#111827", textAlign: "center" },
  nameText:         { textAlign: "left", fontWeight: "500" },
  snoColumn:        { flex: 1 },
  nameColumn:       { flex: 4 },
  emptyState:       { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText:        { fontSize: 14, color: "#9CA3AF" },

  // FAB
  fab:              { backgroundColor: COLORS.primary, height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", position: "absolute", bottom: 50, right: 50 },

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
  inputLabel:       { fontSize: 15, fontWeight: "600", color: "#374151", marginBottom: 6, marginTop: 12 },
  required:         { color: "#EF4444", fontWeight: "600" },
  optional:         { fontWeight: "400", color: "#9CA3AF", fontSize: 13 },
  input:            { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1, borderColor: "#E5E7EB" },
  multilineInput:   { height: 80, textAlignVertical: "top" },

  // Detail modal
  detailHeader:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  detailName:        { fontSize: 22, fontWeight: "700", color: "#111827"},
  detailField:       { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 10 },
  detailFieldLabel:  { fontSize: 11, fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  detailFieldValue:  { fontSize: 14, color: "#374151", lineHeight: 20 },
  noDetailsText:     { fontSize: 14, color: "#9CA3AF", fontStyle: "italic", marginBottom: 16 },
  remindersBtn:      { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EFF6FF", padding: 14, borderRadius: 12, marginBottom: 16 },
  remindersBtnText:  { flex: 1, fontSize: 15, fontWeight: "600", color: "#2563EB" },
  detailActions:     { flexDirection: "row", gap: 12 },
  editBtn:           { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#EFF6FF", padding: 14, borderRadius: 12 },
  editBtnText:       { fontSize: 15, fontWeight: "600", color: "#2563EB" },
  deleteBtn:         { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FEF2F2", padding: 14, borderRadius: 12 },
  deleteBtnText:     { fontSize: 15, fontWeight: "600", color: "#EF4444" },
});
