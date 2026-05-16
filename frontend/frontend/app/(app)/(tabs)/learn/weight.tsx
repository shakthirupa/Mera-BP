import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const sections = [
  { icon: "calculator-outline",       title: "Caloric balance",                                    content: "Caloric balance means the energy from food equals energy your body uses. Eating more than needed leads to weight gain, which strains the heart and raises blood pressure.",                                                                                    route: "/(app)/(tabs)/learn/weightCaloric" },
  { icon: "nutrition-outline",         title: "Weight reduction diet",                              content: "Weight can be reduced by modifying diet, reducing fat, sugar and salt, and avoiding processed and unhealthy foods.",                                                                                                                                          route: "/(app)/(tabs)/learn/weightDiet" },
  { icon: "fitness-outline",           title: "Exercises for weight reduction",                     content: "Regular aerobic exercise and physical activity help in prevention and control of hypertension and weight-related risk.",                                                                                                                                    route: "/(app)/(tabs)/learn/weightExercise" },
  { icon: "checkmark-circle-outline",  title: "Lifestyle Modifications for maintaining weight loss", content: "Healthy lifestyle practices including sleep, exercise, diet control and avoidance of harmful substances help prevent and manage hypertension.",                                                                                                          route: "/(app)/(tabs)/learn/weightLifestyle" },
];

export default function WeightManagement() {
  const router = useRouter();
  return (
    <ImageBackground source={require("@/assets/images/bh.png")} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Weight Management</Text>
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
