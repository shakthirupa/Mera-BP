import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const sections = [
  { icon: "time-outline",      title: "Monitor medication",              content: "Blood pressure medicines should be taken regularly and monitored under medical supervision.",                                                                                                                    route: "/(app)/(tabs)/learn/medicalMonitor" },
  { icon: "calculator-outline",title: "Pill Count Technique",            content: "Count remaining tablets in your strip and compare with doses you should have taken. Extra tablets mean missed doses.",                                                                                        route: "/(app)/(tabs)/learn/medicalPillCount" },
  { icon: "analytics-outline", title: "Measure your Medical adherence",  content: "Patients should adhere to medication and treatment recommendations under supervision of a physician.",                                                                                                          route: "/(app)/(tabs)/learn/medicalMeasure" },
  { icon: "warning-outline",   title: "Self medication",                 content: "Medicines should not be stopped, modified, or taken without proper medical advice.",                                                                                                                             route: "/(app)/(tabs)/learn/medicalSelf" },
];

export default function MedicalAdherence() {
  const router = useRouter();
  return (
    <ImageBackground source={require("@/assets/images/bh.png")} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Medical Adherence</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sections.map((s) => (
          <TouchableOpacity key={s.title} style={styles.infoCard} onPress={() => router.push(s.route as any)} activeOpacity={0.7}>
            <View style={styles.infoHeader}>
              <Ionicons name={s.icon as any} size={22} color="#2563EB" />
              <Text style={styles.infoTitle}>{s.title}</Text>
            </View>
            <Text style={styles.infoContent}>{s.content}</Text>
            <Text style={styles.readMore}>Read more</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:           { flex: 1 },
  overlay:              { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.4)" },
  header:               { flexDirection: "row", gap: 20, alignItems: "center", paddingHorizontal: 20, marginTop: 40, paddingVertical: 14 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle:          { fontSize: 18, fontWeight: "600", color: "#0F172A", marginLeft: 8 },
  scrollContent:        { padding: 20, paddingTop: 16, paddingBottom: 80 },
  infoCard:             { backgroundColor: "#FFFFFF", borderRadius: 18, paddingVertical: 20, paddingLeft: 15, paddingRight: 10, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  infoHeader:           { flexDirection: "row", alignItems: "center", gap: 10 },
  infoTitle:            { flex: 1, fontSize: 16, fontWeight: "600", color: "#0F172A" },
  infoContent:          { fontSize: 14, color: "#64748B", lineHeight: 24, marginTop: 8, paddingLeft: 32 },
  readMore:             { fontSize: 13, fontWeight: "500", color: "#2563EB", marginTop: 8, paddingLeft: 32 },
});
