import { API } from "@/src/constants/api";
import { getAccessToken } from "@/src/services/tokenStorage";
import { scheduleAllReminders } from "@/src/services/notifications";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Medication {
  id: number;
  name: string;
  purpose?: string;
  instructions?: string;
}

interface Reminder {
  id: number;
  reminderTime: string; // "HH:mm:ss" from backend
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

/** Format a Date to "HH:mm" for display */
const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** Format a Date to "HH:mm:ss" for the API body */
const toApiTime = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

/** Parse "HH:mm:ss" from API into a display string "HH:mm" */
const parseApiTime = (t: string) => t.slice(0, 5);

/** Parse "HH:mm:ss" from API into a Date (for pre-filling the picker) */
const apiTimeToDate = (t: string): Date => {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MedicationDetailScreen() {
  const router = useRouter();
  const { medicationData } = useLocalSearchParams();
  const medication: Medication = JSON.parse(medicationData as string);

  const [reminders,       setReminders]       = useState<Reminder[]>([]);
  const [selectedReminder,setSelectedReminder]= useState<Reminder | null>(null);

  // time picker state — shared between add and edit
  const [pickerTime,     setPickerTime]     = useState(new Date());
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [showAddPicker,  setShowAddPicker]  = useState(false);
  const [showEditPicker, setShowEditPicker] = useState(false);
  const [showEditModal,  setShowEditModal]  = useState(false);

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => { loadReminders(); }, []);

  const loadReminders = async () => {
    try {
      const token    = await getAccessToken();
      const response = await fetch(
        `${API.MEDICATIONS}/${medication.id}/reminders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch reminders");
      setReminders(await response.json());
    } catch {
      Alert.alert("Error", "Failed to load reminders");
    }
  };

  // ── Add ────────────────────────────────────────────────────────────────────
  // Step 1: user taps "Add" → open add modal with time picker inside
  // Step 2: user adjusts time, taps "Save" → POST to API

  const handleAddPickerChange = (event: any, date?: Date) => {
    if (date) setPickerTime(date);
  };

  const handleAddSave = async () => {
    try {
      const token    = await getAccessToken();
      const response = await fetch(
        `${API.MEDICATIONS}/${medication.id}/reminders`,
        {
          method:  "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body:    JSON.stringify({ reminderTime: toApiTime(pickerTime) }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add reminder");
      }
      setShowAddModal(false);
      loadReminders();
      scheduleAllReminders();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  // Step 1: user taps edit icon → open edit modal with current time pre-filled
  // Step 2: user picks a new time in the modal → PUT to API

  const openEditModal = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setPickerTime(apiTimeToDate(reminder.reminderTime));
    setShowEditModal(true);
  };

  const handleEditPickerChange = (event: any, date?: Date) => {
    setShowEditPicker(false);
    // "dismissed" fires on Android when user cancels — keep existing time
    if (event?.type === "dismissed" || !date) return;
    setPickerTime(date);
  };

  const handleEditSave = async () => {
    if (!selectedReminder) return;
    try {
      const token    = await getAccessToken();
      const response = await fetch(
        `${API.MEDICATIONS}/${medication.id}/reminders/${selectedReminder.id}`,
        {
          method:  "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body:    JSON.stringify({ reminderTime: toApiTime(pickerTime) }),
        }
      );
      if (!response.ok) throw new Error("Failed to update reminder");
      setShowEditModal(false);
      setSelectedReminder(null);
      loadReminders();
      scheduleAllReminders();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = (reminder: Reminder) => {
    Alert.alert(
      "Delete Reminder",
      `Remove the ${parseApiTime(reminder.reminderTime)} reminder?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              const token    = await getAccessToken();
              const response = await fetch(
                `${API.MEDICATIONS}/${medication.id}/reminders/${reminder.id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
              );
              if (!response.ok) throw new Error("Failed to delete reminder");
              loadReminders();
              scheduleAllReminders();
            } catch {
              Alert.alert("Error", "Failed to delete reminder");
            }
          },
        },
      ]
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ImageBackground
      source={require("@/assets/images/medication.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reminders</Text>
          <View style={{ width: 24 }} />
        </View>
        
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>

        {/* Medication card */}
        <View style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <View style={styles.pillIcon}>
              <Ionicons name="medical" size={24} color="#2563EB" />
            </View>
            <Text style={styles.medicationName}>{medication.name}</Text>
          </View>

          {medication.purpose ? (
            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Purpose</Text>
              <Text style={styles.sectionContent}>{medication.purpose}</Text>
            </View>
          ) : null}

          {medication.instructions ? (
            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Instructions</Text>
              <Text style={styles.sectionContent}>{medication.instructions}</Text>
            </View>
          ) : null}

          {!medication.purpose && !medication.instructions && (
            <Text style={styles.noDetails}>No additional details added.</Text>
          )}
        </View>

        {/* Reminders section */}
        <View style={styles.remindersCard}>
          <View style={styles.remindersHeader}>
            <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
                  <Ionicons name="alarm" size={24} color="#2563EB" />
            <Text style={styles.remindersTitle}>Reminders</Text>

            </View>

            <TouchableOpacity
              style={styles.addReminderBtn}
              onPress={() => { setPickerTime(new Date()); setShowAddModal(true); }}
            >
              <Ionicons name="add" size={18} color="#2563EB" />
              <Text style={styles.addReminderText}>Add</Text>
            </TouchableOpacity>
          </View>

          {reminders.length === 0 ? (
            <View style={styles.emptyReminders}>
              <Ionicons name="alarm-outline" size={36} color="#D1D5DB" />
              <Text style={styles.emptyText}>No reminders set</Text>
              <Text style={styles.emptySubText}>
                Tap Add to set a daily reminder for this medication
              </Text>
            </View>
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderItem}>
                  <TouchableOpacity
                    style={styles.reminderActionBtn}
                    onPress={() => openEditModal(reminder)}
                  >
                    <Ionicons name="pencil-outline" size={16} color="#2563EB" />
                  </TouchableOpacity>
                <Text style={styles.reminderTimeText}>
                  {parseApiTime(reminder.reminderTime)}
                </Text>
                  <TouchableOpacity
                    style={[styles.reminderActionBtn, styles.reminderDeleteBtn]}
                    onPress={() => handleDelete(reminder)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* ── ADD MODAL ─────────────────────────────────────────────── */}
      <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Reminder</Text>
            <TouchableOpacity style={styles.timePickerBtn} onPress={() => setShowAddPicker(true)}>
              <Ionicons name="alarm-outline" size={22} color="#2563EB" />
              <Text style={styles.timePickerText}>{formatTime(pickerTime)}</Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
            {showAddPicker && (
              <DateTimePicker
                value={pickerTime}
                mode="time"
                display="default"
                onChange={(e, d) => { setShowAddPicker(false); if (d) setPickerTime(d); }}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── EDIT MODAL ────────────────────────────────────────────── */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Reminder</Text>

            {/* Time display + picker trigger */}
            <TouchableOpacity
              style={styles.timePickerBtn}
              onPress={() => setShowEditPicker(true)}
            >
              <Ionicons name="alarm-outline" size={22} color="#2563EB" />
              <Text style={styles.timePickerText}>{formatTime(pickerTime)}</Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {showEditPicker && (
              <DateTimePicker
                value={pickerTime}
                mode="time"
                display="default"
                onChange={handleEditPickerChange}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setShowEditModal(false); setSelectedReminder(null); }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleEditSave}>
                <Text style={styles.saveText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backgroundImage:   { flex: 1 },
  container:         { flex: 1, backgroundColor: "transparent", padding: 20 },
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 40, paddingVertical: 14 },
  headerTitle:      { fontSize: 20, fontWeight: "600", color: "#0F172A" },

  // Medication card
  medicationCard:    { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  medicationHeader:  { flexDirection: "row", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  pillIcon:          { width: 48, height: 48, borderRadius: 12, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center", marginRight: 14 },
  medicationName:    { fontSize: 20, fontWeight: "700", color: "#111827", flex: 1 },
  detailSection:     { marginBottom: 12 },
  sectionLabel:      { fontSize: 11, fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  sectionContent:    { fontSize: 15, color: "#374151", lineHeight: 22 },
  noDetails:         { fontSize: 14, color: "#9CA3AF", fontStyle: "italic" },

  // Reminders card
  remindersCard:     { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  remindersHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  remindersTitle:    { fontSize: 16, fontWeight: "700", color: "#111827" },
  addReminderBtn:    { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  addReminderText:   { fontSize: 13, fontWeight: "600", color: "#2563EB" },
  emptyReminders:    { alignItems: "center", paddingVertical: 24, gap: 6 },
  emptyText:         { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  emptySubText:      { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
  reminderItem:      { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", padding: 14, borderRadius: 12, marginBottom: 8, gap: 12 },
  reminderIconWrap:  { width: 36, height: 36, borderRadius: 10, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  reminderTimeText:  { flex: 1, fontSize: 18, fontWeight: "700", color: "#111827" },
  reminderActionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  reminderDeleteBtn: { backgroundColor: "#FEF2F2" },

  // Modal
  modalOverlay:      { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent:      { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, width: "85%", maxWidth: 400 },
  modalTitle:        { fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 20 },
  timePickerBtn:     { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 16, marginBottom: 20 },
  timePickerText:    { flex: 1, fontSize: 28, fontWeight: "700", color: "#111827", textAlign: "center" },
  modalButtons:      { flexDirection: "row", gap: 12 },
  cancelBtn:         { flex: 1, backgroundColor: "#F3F4F6", padding: 16, borderRadius: 12, alignItems: "center" },
  cancelText:        { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  saveBtn:           { flex: 1, backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center" },
  saveText:          { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
});
