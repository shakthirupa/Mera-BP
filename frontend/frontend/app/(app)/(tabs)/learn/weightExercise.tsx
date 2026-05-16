import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

const scenes = [
  {
    patientImg: require("@/assets/images/scene1pphy.png"),
    doctorImg: require("@/assets/images/scene1dphy.png"),
    patientText: "Doctor, what exercises should I do for weight reduction?",
    doctorText: "You should focus mainly on regular physical activity and aerobic exercise, which use large muscle groups and increase your breathing and heart rate for a sustained period.",
  },
  {
    patientImg: require("@/assets/images/scene2pphy.png"),
    doctorImg: require("@/assets/images/scene2dphy.png"),
    patientText: "Can you give me some examples?",
    doctorText: "Yes, examples include brisk walking, jogging, cycling, swimming, and dancing. Brisk walking is especially recommended because it is simple, safe, and easy to continue.",
  },
  {
    patientImg: require("@/assets/images/scene3pphy.png"),
    doctorImg: require("@/assets/images/scene3dphy.png"),
    patientText: "How often should I exercise?",
    doctorText: "You should do at least 30 minutes of moderate physical activity daily for effective weight reduction.",
  },
  {
    patientImg: require("@/assets/images/scene4pphy.png"),
    doctorImg: require("@/assets/images/scene4dphy.png"),
    patientText: "How does exercise help in reducing weight?",
    doctorText: "Exercise burns calories, reduces body fat, strengthens the heart, and lowers blood pressure.",
  },
  {
    patientImg: require("@/assets/images/scene5pphy.png"),
    doctorImg: require("@/assets/images/scene5dphy.png"),
    patientText: "Is exercise alone enough for weight loss?",
    doctorText: "The best results come from combining a healthy diet, portion control, and regular physical activity.",
  },
  {
    patientImg: require("@/assets/images/scene6pphy.png"),
    doctorImg: require("@/assets/images/scene6dphy.png"),
    patientText: "Can I include yoga also?",
    doctorText: "Yes, yoga can be used as a supportive activity. It helps in reducing stress, improving sleep, and overall health, which indirectly supports weight control.",
  },
  {
    patientImg: require("@/assets/images/scene1pphy.png"),
    doctorImg: require("@/assets/images/scene1dphy.png"),
    patientText: "How should I start?",
    doctorText: "Start slowly with simple activities like walking, be consistent, and gradually increase your duration and intensity.",
  },
  {
    patientImg: require("@/assets/images/scene2pphy.png"),
    doctorImg: require("@/assets/images/scene2dphy.png"),
    patientText: "So what should I follow overall?",
    doctorText: "Focus on regular aerobic exercise daily, stay consistent, and combine it with a healthy diet. This will help you achieve and maintain weight reduction effectively.",
  },
];

export default function WeightExercise() {
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
            <Text style={styles.title}>Exercise for Weight Reduction</Text>
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
  sceneImage: { width: 80, height: 130, resizeMode: "contain" },
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
