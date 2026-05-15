import { API } from "@/src/constants/api";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword,     setCurrentPassword]     = useState("");
  const [newPassword,         setNewPassword]         = useState("");
  const [confirmPassword,     setConfirmPassword]     = useState("");
  const [showCurrent,         setShowCurrent]         = useState(false);
  const [showNew,             setShowNew]             = useState(false);
  const [showConfirm,         setShowConfirm]         = useState(false);
  const [loading,             setLoading]             = useState(false);

  async function handleSave() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    const strong = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strong.test(newPassword)) {
      Alert.alert("Error", "Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character.");
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(API.CHANGE_PASSWORD, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password.");
      Alert.alert("Success", "Password changed successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require("@/assets/images/bb.png")} style={styles.bg} resizeMode="cover">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>

          {[
            { label: "Current Password",  value: currentPassword,  setter: setCurrentPassword,  show: showCurrent, toggleShow: () => setShowCurrent(v => !v) },
            { label: "New Password",      value: newPassword,      setter: setNewPassword,      show: showNew,     toggleShow: () => setShowNew(v => !v) },
            { label: "Confirm Password",  value: confirmPassword,  setter: setConfirmPassword,  show: showConfirm, toggleShow: () => setShowConfirm(v => !v) },
          ].map(({ label, value, setter, show, toggleShow }) => (
            <View key={label} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setter}
                  secureTextEntry={!show}
                  placeholder={label}
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={toggleShow} style={styles.eyeBtn}>
                  <Ionicons name={show ? "eye-outline" : "eye-off-outline"} size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.disabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>Save Password</Text>
            }
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:          { flex: 1 },
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingVertical: 14, paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  content:     { padding: 20, paddingBottom: 60 },
  card:        { backgroundColor: "#FFF", borderRadius: 20, padding: 24, elevation: 4, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10 },
  inputGroup:  { marginBottom: 20 },
  label:       { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  inputRow:    { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 14 },
  input:       { flex: 1, fontSize: 15, color: "#111827", paddingVertical: 14 },
  eyeBtn:      { padding: 4 },
  saveBtn:     { backgroundColor: "#2563EB", borderRadius: 32, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  disabled:    { opacity: 0.7 },
});
