import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PolicyView() {
  const router = useRouter();

  return (
    <ImageBackground source={require("../../../assets/images/bb.png")} resizeMode="cover" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>
          <View>
            <Text style={styles.mainTitle}>Terms and Privacy</Text>
            <Text style={styles.dateText}>Last Updated: October 2023</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>1. Introduction</Text>
            </View>
            <Text style={styles.bodyText}>
              Welcome to Mera BP. By accessing or using our hypertension care application, you agree to be bound by these Terms of Service and our Privacy Policy.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>2. Health Data Privacy</Text>
            </View>
            <Text style={styles.bodyText}>We take your health privacy seriously. We collect blood pressure readings, medication schedules, and other relevant health metrics to provide personalized care.</Text>
            <Text style={styles.bodyText}>- Data is encrypted end-to-end.</Text>
            <Text style={styles.bodyText}>- We do not sell your personal health data to third parties.</Text>
            <Text style={styles.bodyText}>- You can request data deletion at any time.</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="finger-print-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>3. User Account</Text>
            </View>
            <Text style={styles.bodyText}>
              You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>4. Medical Disclaimer</Text>
            </View>
            <Text style={styles.bodyText}>
              Mera BP is an informational tool and does not constitute medical advice. Always consult with a qualified healthcare professional before making medical decisions.
            </Text>
          </View>

          <View style={styles.contactBlock}>
            <Text style={styles.contactLabel}>Questions?</Text>
            <Text style={styles.contactLink}>support@merabp.com</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, paddingTop: 40 },
  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 80 },
  topBar:        { marginTop: 20, marginBottom: 40, flexDirection: "row", gap: 16 },
  backButton:    { width: 50, height: 50, backgroundColor: "#FFF", borderRadius: 25, justifyContent: "center", alignItems: "center", borderWidth: 0.5, borderColor: "#E2E8F0" },
  mainTitle:     { fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 5 },
  dateText:      { fontSize: 13, color: "#94A3B8" },
  card:          { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  sectionBlock:  { marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sectionTitle:  { fontSize: 16, fontWeight: "700", color: "#0F172A", marginLeft: 8 },
  bodyText:      { fontSize: 14, color: "#64748B", lineHeight: 22, marginBottom: 4, textAlign: "justify" },
  divider:       { height: 1, backgroundColor: "#F1F5F9", marginVertical: 20 },
  contactBlock:  { alignItems: "center", marginTop: 10 },
  contactLabel:  { fontSize: 14, color: "#64748B", marginBottom: 4 },
  contactLink:   { fontSize: 16, color: "#2563EB", fontWeight: "600" },
});
