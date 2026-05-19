import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

const scenes = [
  {
    patientImg: require("@/assets/images/scene1spbp.png"),
    doctorImg: require("@/assets/images/scene1sdbp.png"),
    patientText: "Doctor, what lifestyle changes should I follow to maintain weight loss?",
    doctorText: "You should continue with a weight reduction programme supervised by dietitians and follow active dietary advice for weight reduction.",
  },
  {
    patientImg: require("@/assets/images/scene2spbp.png"),
    doctorImg: require("@/assets/images/scene2sdbp.png"),
    patientText: "Why is weight loss so important for me?",
    doctorText: "It was emphasized from the beginning that reducing blood pressure was the purpose of the diet. Weight reduction appears to be an effective first-line therapy for patients with hypertension.",
  },
  {
    patientImg: require("@/assets/images/scene3spbp.png"),
    doctorImg: require("@/assets/images/scene3sdbp.png"),
    patientText: "What specific dietary habits should I maintain?",
    doctorText: "You should follow modest restriction of salt use and reduction of excessive alcohol intake. These help in controlling blood pressure along with weight.",
  },
  {
    patientImg: require("@/assets/images/scene4spbp.png"),
    doctorImg: require("@/assets/images/scene4sdbp.png"),
    patientText: "How can I track my progress?",
    doctorText: "You should maintain a weight chart to record your weight at each visit. Some patients also keep a blood pressure chart alongside so they can follow the progress of both measurements.",
  },
  {
    patientImg: require("@/assets/images/scene1spbp.png"),
    doctorImg: require("@/assets/images/scene1sdbp.png"),
    patientText: "Will these changes really last long?",
    doctorText: "Yes. Studies have shown that the early changes achieved in both weight and blood pressure were maintained over time.",
  },
  {
    patientImg: require("@/assets/images/scene2spbp.png"),
    doctorImg: require("@/assets/images/scene2sdbp.png"),
    patientText: "What helps people stick to this program?",
    doctorText: "Raised blood pressure appears to provide motivation for patients to attend a dietitian's clinic and to lose weight. Knowing the health risk keeps people committed.",
  },
  {
    patientImg: require("@/assets/images/scene3spbp.png"),
    doctorImg: require("@/assets/images/scene3sdbp.png"),
    patientText: "Is follow-up important?",
    doctorText: "Yes, because follow-up of defaulters must be made a part of such a programme. This ensures patients continue and maintain their results.",
  },
  {
    patientImg: require("@/assets/images/scene4spbp.png"),
    doctorImg: require("@/assets/images/scene4sdbp.png"),
    patientText: "So overall, what should I focus on?",
    doctorText: "Focus on maintaining your diet, regular monitoring, and remember that lower blood pressures were achieved by the group who lost weight. Consistency is the key.",
  },
];

export default function WeightLifestyle() {
  const router = useRouter();

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const speak = (text: string, isDoctor = false) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: isDoctor ? 1.2 : 0.6, language: 'en-IN' });
  };

  return (
    <ImageBackground source={require("@/assets/images/we.png")} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.3 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Lifestyle Modifications</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {scenes.map((scene, index) => (
          <View key={index} style={styles.scene}>
            <View style={styles.chat}>
              <View style={styles.patientRow}>
                <Image source={scene.patientImg} style={styles.sceneImage} />
                <TouchableOpacity style={styles.patientBubble} onPress={() => speak(scene.patientText)}>
                  <Text style={styles.patientLabel}>👤 Patient:</Text>
                  <Text style={styles.chatText}>"{scene.patientText}"</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.doctorRow}>
                <TouchableOpacity style={styles.doctorBubble} onPress={() => speak(scene.doctorText, true)}>
                  <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                  <Text style={styles.chatText}>"{scene.doctorText}"</Text>
                </TouchableOpacity>
                <Image source={scene.doctorImg} style={styles.sceneImage} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
    paddingVertical: 14,
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", color: "#000", marginLeft: 8 },
  scene: { marginBottom: 32 },
  chat: { gap: 16 },
  patientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginRight: 20,
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginLeft: 20,
  },
  sceneImage: { width: 120, height: 120, resizeMode: "contain" },
  patientBubble: {
    backgroundColor: "rgba(42, 127, 255, 0.08)",
    borderRadius: 24,
    padding: 18,
    flex: 1,
    borderBottomLeftRadius: 6,
    shadowColor: "#2A7FFF",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  doctorBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    flex: 1,
    borderBottomRightRadius: 6,
    shadowColor: "#10B981",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  patientLabel: { fontSize: 14, fontWeight: "700", color: "#2563EB", marginBottom: 6 },
  doctorLabel: { fontSize: 14, fontWeight: "700", color: "#059669", marginBottom: 6 },
  chatText: { fontSize: 16, color: "#1F2937", lineHeight: 26, fontWeight: "500" },
});
