import { API } from "@/src/constants/api";
import { useSignup } from "@/src/context/SignupContext";
import { useAuth } from "@/src/providers/AuthContext";
import { saveName } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TermsAndPolicy() {

  const { signIn } = useAuth();
  const { signupData } = useSignup();

  const [isAccepted, setIsAccepted] = useState(false);
  const [signing, setSigning] = useState(false);

  const isPhone = signupData?.signupMethod === "phone";
  const SEND_URL = isPhone ? API.COMPLETE_PHONE_SIGNUP : API.COMPLETE_EMAIL_SIGNUP;

  async function handleContinue() {
    if (!isAccepted) return;
    setSigning(true);
    try {
      const body = {
        dateOfBirth: signupData.dob,
        gender: signupData.gender,
        password: signupData.password,
        termsAccepted: isAccepted,
      };
      const response = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${signupData.onboardingToken}` },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed.");
      if (signupData.fullName) await saveName(signupData.fullName);
      await signIn(data.accessToken, data.refreshToken);
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Something went wrong.");
    } finally {
      setSigning(false);
    }
  }

  async function handleGoogleContinue() {
    if (!isAccepted) return;
    setSigning(true);
    try {
      const body = {
        dateOfBirth: signupData.dob,
        gender: signupData.gender,
        termsAccepted: isAccepted,
      };
      const response = await fetch(API.GOOGLE_COMPLETE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${signupData.onboardingToken}` },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed.");
      if (signupData.fullName) await saveName(signupData.fullName);
      await signIn(data.accessToken, data.refreshToken);
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Something went wrong.");
    } finally {
      setSigning(false);
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/bb.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={"#111"} />
          </TouchableOpacity>
          <View>
            <Text style={styles.mainTitle}>Terms, Privacy & Consent</Text>
            <Text style={styles.dateText}>Last Updated: May 2025</Text>
          </View>
        </View>

        {/* ── Terms & Conditions Card ── */}
        <View style={styles.card}>
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>1. Purpose of the Application</Text>
            </View>
            <Text style={styles.bodyText}>
              This application provides health education, lifestyle guidance, and tools to track selected health information such as blood pressure, weight, physical activity, and medication reminders. The information provided is intended for education and self-management support only and does not replace medical advice, diagnosis, or treatment from a qualified healthcare professional.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>2. Eligibility</Text>
            </View>
            <Text style={styles.bodyText}>
              Users must be 18 years or older or use the application under the supervision of a guardian. By registering, you confirm that the information you provide is accurate to the best of your knowledge.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>3. Information We Collect</Text>
            </View>
            <Text style={styles.bodyText}>
              The application may collect basic personal information (such as name, age, gender, and contact details) and health-related information (such as blood pressure readings, weight, physical activity, medication adherence, and lifestyle information). Basic device and app usage information may also be collected to ensure proper functioning of the application.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>4. Use of Information</Text>
            </View>
            <Text style={styles.bodyText}>
              Collected information is used to provide health education, reminders, and personal health tracking. It may also be used to improve the application and support health research or program evaluation. Whenever possible, research analyses will use anonymized or de-identified data.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>5. Confidentiality and Data Protection</Text>
            </View>
            <Text style={styles.bodyText}>
              Your information will be stored in secure systems and accessed only by authorized personnel. Reasonable safeguards are used to protect privacy and confidentiality. However, no digital system can guarantee absolute security.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="share-social-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>6. Data Sharing</Text>
            </View>
            <Text style={styles.bodyText}>
              Information may be shared with authorized healthcare providers or project staff when necessary for health support or program implementation. Data may also be used in aggregated or anonymized form for research or reporting purposes. Personal information will not be sold or used for commercial marketing.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="hand-left-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>7. Voluntary Participation</Text>
            </View>
            <Text style={styles.bodyText}>
              Use of this application is voluntary. You may stop using the app or withdraw consent at any time. Choosing not to use the application will not affect your access to routine healthcare services.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>8. Limitations</Text>
            </View>
            <Text style={styles.bodyText}>
              This application does not provide medical diagnosis and should not be used during medical emergencies. Users should consult qualified healthcare professionals for medical concerns.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>9. Contact Information</Text>
            </View>
            <Text style={styles.bodyText}>
              For questions about the application or your data, please contact: Mera BP Support, support@merabp.com
            </Text>
          </View>
        </View>

        {/* ── User Consent Card ── */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>User Consent Statement</Text>
          </View>
          <Text style={[styles.bodyText, { marginTop: 8, marginBottom: 20 }]}>
            By selecting 'I Agree', you confirm that you have read and understood these terms and voluntarily consent to the collection and secure storage of your health information as described above.
          </Text>

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsAccepted(!isAccepted)}>
            <View style={[styles.checkbox, isAccepted && styles.checkboxChecked]}>
              {isAccepted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>I have read and understood the Terms of Use, Privacy Notice, and User Consent Statement, and I voluntarily agree.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, (!isAccepted || signing) && styles.acceptButtonDisabled]}
            onPress={signupData.onboardingToken && signupData.password ? handleContinue : handleGoogleContinue}
            disabled={!isAccepted || signing}
          >
            {signing
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.acceptText}>I Agree and Continue</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, paddingTop: 40 },
  scrollContent:        { flexGrow: 1, padding: 20, paddingBottom: 80 },
  topBar:               { marginTop: 20, marginBottom: 40, flexDirection: "row", gap: 16 },
  backButton:           { width: 50, height: 50, backgroundColor: "#FFF", borderRadius: 25, justifyContent: "center", alignItems: "center", borderWidth: 0.5, borderColor: "#E2E8F0" },
  mainTitle:            { fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 5 },
  dateText:             { fontSize: 13, color: "#94A3B8" },
  card:                 { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  sectionBlock:         { marginBottom: 20 },
  sectionHeader:        { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sectionTitle:         { fontSize: 16, fontWeight: "700", color: "#0F172A", marginLeft: 8 },
  bodyText:             { fontSize: 14, color: "#64748B", lineHeight: 22, marginBottom: 4, textAlign: "justify" },
  divider:              { height: 1, backgroundColor: "#F1F5F9", marginVertical: 20 },

  acceptButton:         { backgroundColor: "#2563EB", borderRadius: 32, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  acceptButtonDisabled: { opacity: 0.7 },
  acceptText:           { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  checkboxContainer:    { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkbox:             { width: 24, height: 24, borderWidth: 2, borderColor: "#E2E8F0", borderRadius: 6, marginRight: 12, alignItems: "center", justifyContent: "center" },
  checkboxChecked:      { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  checkboxText:         { flex: 1, fontSize: 14, color: "#64748B", lineHeight: 20 },
});
