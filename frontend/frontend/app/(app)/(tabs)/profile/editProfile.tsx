import { API } from "@/src/constants/api";
import { useAuth } from "@/src/providers/AuthContext";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const pad = (n: number) => String(n).padStart(2, "0");
const toApiDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const formatDisplay = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const parseApiDate = (s?: string): Date => {
  if (!s) return new Date();
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export default function EditProfileScreen() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [name,          setName]          = useState(user?.name ?? "");
  const [gender,        setGender]        = useState(user?.gender ?? "");
  const [dob,           setDob]           = useState<Date>(parseApiDate(user?.dateOfBirth));
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [loading,       setLoading]       = useState(false);

  const isFormValid = () => name.trim() !== "" && gender !== "";

  const handleSave = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(API.UPDATE_PROFILE, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ name: name.trim(), dateOfBirth: toApiDate(dob), gender }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");
      setUser?.({ ...user!, ...data });
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDobChange = (event: any, date?: Date) => {
    setShowDobPicker(false);
    if (event.type === "dismissed" || !date) return;
    setDob(date);
  };

  return (
    <ImageBackground source={require("@/assets/images/bb.png")} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.formSection}>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDobPicker(true)} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={20} color="#2563EB" />
              <Text style={styles.dateBtnText}>{formatDisplay(dob)}</Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {["MALE", "FEMALE", "OTHER"].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>

        <TouchableOpacity
          style={[styles.saveBtn, (!isFormValid() || loading) && styles.disabledBtn]}
          onPress={handleSave}
          disabled={!isFormValid() || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>

      {showDobPicker && (
        <DateTimePicker value={dob} mode="date" display="default" maximumDate={new Date()} onChange={handleDobChange} />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage:  { flex: 1 },
  container:        { flex: 1, backgroundColor: "transparent", padding: 20 },
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingVertical: 14, paddingHorizontal: 20 },
  headerTitle:      { fontSize: 20, fontWeight: "700", color: "#000" },
  formSection:      { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  inputGroup:       { marginBottom: 18 },
  label:            { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input:            { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 14, fontSize: 16, color: "#111827", borderWidth: 1, borderColor: "#E5E7EB" },
  dateBtn:          { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E5E7EB" },
  dateBtnText:      { flex: 1, fontSize: 16, color: "#111827" },
  genderContainer:  { flexDirection: "row", gap: 10 },
  genderBtn:        { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center" },
  genderBtnActive:  { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  genderText:       { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  genderTextActive: { color: "#FFFFFF" },
  saveBtn:          { backgroundColor: "#2563EB", paddingVertical: 16, borderRadius: 12, alignItems: "center", shadowColor: "#2563EB", shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveBtnText:      { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  disabledBtn:      { opacity: 0.45 },
});
