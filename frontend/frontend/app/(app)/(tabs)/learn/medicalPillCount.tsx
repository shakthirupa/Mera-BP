import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

const scenes = [
  {
    patientImg: require("@/assets/images/scene1pillp.png"),
    doctorImg: require("@/assets/images/scene1pilld.png"),
    patientText: "What is the pill count technique for BP medicines?",
    doctorText: "The pill count technique is a simple way to check whether you are taking your blood pressure medicines regularly. It means counting how many tablets are left in your medicine strip or bottle and comparing it with how many you were supposed to take. If the numbers match, it shows you are taking your medicines properly. This method is commonly used by doctors to understand medication adherence.",
  },
  {
    patientImg: require("@/assets/images/scene2pillp.png"),
    doctorImg: require("@/assets/images/scene2pilld.png"),
    patientText: "How can counting my BP tablets help me manage my blood pressure better?",
    doctorText: "Counting your tablets helps you become more aware of whether you are missing doses. Many patients forget medicines without realizing it. When you regularly check how many tablets are left, you can identify missed doses early and correct the habit. Taking BP medicines regularly is very important to prevent serious complications like stroke, heart attack, and kidney damage.",
  },
  {
    patientImg: require("@/assets/images/scene3pillp.png"),
    doctorImg: require("@/assets/images/scene3pilld.png"),
    patientText: "How do I do pill counting at home for my BP medicines?",
    doctorText: "First, note how many tablets were given to you and how many you should take each day. After a few days or at the end of the week, count how many tablets are left in the strip or bottle. Compare this with the number that should remain if you took them correctly. If more tablets are left, it means some doses were missed.",
  },
  {
    patientImg: require("@/assets/images/scene4pillp.png"),
    doctorImg: require("@/assets/images/scene4pilld.png"),
    patientText: "Are there any problems or limitations with the pill count method?",
    doctorText: "Yes, pill counting is helpful but not perfect. Sometimes patients may forget to bring all their medicines for counting, or tablets may be lost or discarded. In such cases, the count may not show the correct picture of medicine use. Also, counting tablets cannot confirm whether the patient actually swallowed the medicine or just removed it from the pack.",
  },
  {
    patientImg: require("@/assets/images/scene5pillp.png"),
    doctorImg: require("@/assets/images/scene5pilld.png"),
    patientText: "If pill counting feels difficult, are there other ways to track my BP medicines?",
    doctorText: "Yes, there are several alternatives. You can use a daily pill box, set alarms on your phone, mark doses on a calendar, or use medication reminder apps. Some patients also ask a family member to remind them. The goal is to develop a routine so that taking your blood pressure medicines becomes a regular daily habit.",
  },
];

export default function MedicalPillCount() {
  const router = useRouter();

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const speak = (text: string, isDoctor = false) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: 1.2, language: 'en-IN' });
  };

  return (
    <ImageBackground source={require("@/assets/images/medical.png")} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.3 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Pill Count Technique</Text>
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
