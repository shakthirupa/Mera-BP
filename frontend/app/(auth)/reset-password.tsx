import { COLORS } from "@/src/constants/theme";
import { resetPassword } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, Alert, Image, ImageBackground,
  Keyboard, StyleSheet, Text, TextInput,
  TouchableOpacity, TouchableWithoutFeedback, View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; resetToken: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const resetToken = Array.isArray(params.resetToken) ? params.resetToken[0] : params.resetToken;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) return Alert.alert("Error", "Password must be at least 8 characters with one uppercase letter, one number, and one special character.");
    if (password !== confirm) return Alert.alert("Error", "Passwords do not match.");
    setLoading(true);
    console.log("email:", email, "resetToken:", resetToken, "password:", password);
    try {
      await resetPassword(email, resetToken, password);
      Alert.alert("Success", "Password reset successfully.", [
        { text: "Login", onPress: () => router.replace("/(auth)") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require("../../assets/images/bb.png")} resizeMode="cover" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={40} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
            <View style={styles.appNameContainer}>
              <Text style={styles.appName}>Mera</Text>
              <Text style={styles.bpText}>BP</Text>
            </View>
            <Text style={styles.tagline}>Your Hypertension Care Partner</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.desc}>Min 8 chars · one uppercase · one number · one special character</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                autoFocus
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPass}
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, (!password || !confirm || loading) && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={!password || !confirm || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Reset Password</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.backContainer} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, paddingTop: 40 },
  scrollContent:    { flexGrow: 1, padding: 20, paddingBottom: 80 },
  logoContainer:    { alignItems: "center", marginBottom: 20, marginTop: 60 },
  logo:             { width: 90, height: 90 },
  appNameContainer: { flexDirection: "row", alignItems: "center" },
  appName:          { fontSize: 32, fontFamily: "Poppins-Black", color: "#2563EB" },
  bpText:           { fontSize: 32, fontFamily: "Poppins-Black", color: "#EF4444", marginLeft: 6 },
  tagline:          { fontSize: 14, color: "#64748B" },
  card:             { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  title:            { fontSize: 20, fontWeight: "700", color: COLORS.primary, marginBottom: 8, textAlign: "center" },
  desc:             { fontSize: 14, color: "#64748B", marginBottom: 20, textAlign: "center", lineHeight: 20 },
  inputContainer:   { flexDirection: "row", alignItems: "center", borderWidth: 0.5, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 12 },
  input:            { flex: 1, marginLeft: 8, fontSize: 15, color: COLORS.text },
  loginButton:      { backgroundColor: COLORS.primary, borderRadius: 34, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  buttonDisabled:   { opacity: 0.7 },
  loginText:        { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  backContainer:    { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  backText:         { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
});
