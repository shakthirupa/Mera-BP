import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

const scenes = [
  {
    patientImg: require("@/assets/images/scene1selfp.png"),
    doctorImg: require("@/assets/images/scene1selfd.png"),
    patientText: "My blood pressure has been high for a few days. Can I just start taking BP medicines on my own?",
    doctorText: "It is not safe to start blood pressure medicines without consulting a doctor. Hypertension medicines must be chosen based on your age, other diseases, and your BP readings over time. Taking the wrong medicine or dose may cause dizziness, fainting, or kidney problems. Always consult a doctor before starting any medication.",
  },
  {
    patientImg: require("@/assets/images/scene2selfp.png"),
    doctorImg: require("@/assets/images/scene2selfd.png"),
    patientText: "My neighbour takes BP medicine and says it works well. Can I take the same medicine?",
    doctorText: "No, you should not take medicines just because they work for someone else. Blood pressure medicines are prescribed individually. What suits your neighbour may not be safe for you. Some medicines can interact with other drugs you take or worsen certain health conditions. Always get your blood pressure evaluated by a doctor.",
  },
  {
    patientImg: require("@/assets/images/scene3selfp.png"),
    doctorImg: require("@/assets/images/scene3selfd.png"),
    patientText: "I had BP medicines earlier. Can I reuse the same prescription without seeing the doctor again?",
    doctorText: "It is better to consult your doctor again before restarting old medicines. Your blood pressure level, weight, lifestyle, or other health conditions may have changed since the last prescription. Using an old prescription can lead to incorrect dosage or ineffective treatment.",
  },
  {
    patientImg: require("@/assets/images/scene4selfp.png"),
    doctorImg: require("@/assets/images/scene4selfd.png"),
    patientText: "Sometimes I feel fine. Can I stop my BP medicines and take them only when my BP feels high?",
    doctorText: "No. Hypertension is often called a \"silent disease\" because you may feel normal even when your BP is high. Stopping medicines on your own can cause sudden rises in blood pressure, increasing the risk of stroke, heart attack, or kidney damage. Medicines should be taken regularly as prescribed, even if you feel well.",
    overlayImg: require("@/assets/images/pat.png"),
  },
  {
    patientImg: require("@/assets/images/scene5selfp.png"),
    doctorImg: require("@/assets/images/scene5selfd.png"),
    patientText: "Can I take herbal remedies like garlic, neem, or home remedies instead of BP medicines?",
    doctorText: "Some people use herbal remedies believing they help reduce blood pressure, but there is limited scientific proof of their safety and effectiveness. Certain herbs may also interact with BP medicines or cause side effects. For example, garlic supplements may increase bleeding risk with some drugs. Always discuss any herbal remedies with your doctor before using them.",
  },
  {
    patientImg: require("@/assets/images/scene6selfp.png"),
    doctorImg: require("@/assets/images/scene6selfd.png"),
    patientText: "Is it okay to buy BP medicines directly from a pharmacy without a prescription?",
    doctorText: "Buying BP medicines without a prescription is risky. These medicines can cause side effects such as low blood pressure, dizziness, or harmful drug interactions. Many people who self-medicate do not know the correct dose or possible risks. It is always safer to take these medicines under medical supervision.",
  },
  {
    patientImg: require("@/assets/images/scene7selfp.png"),
    doctorImg: require("@/assets/images/scene7selfd.png"),
    patientText: "Can taking BP medicines on my own cause any serious problems?",
    doctorText: "Yes, self-medication can lead to several problems. You may take the wrong medicine, incorrect dose, or combine medicines that interact with each other. This can cause side effects such as very low blood pressure, irregular heartbeat, kidney problems, or risk of gastrointestinal bleeding. Self-medication can also delay proper diagnosis and treatment.",
  },
  {
    patientImg: require("@/assets/images/scene8selfp.png"),
    doctorImg: require("@/assets/images/scene8selfd.png"),
    patientText: "Why is it important to talk to my doctor before taking any medicine for BP?",
    doctorText: "Your doctor checks many factors before prescribing treatment, such as your BP readings, other diseases like diabetes, and medicines you already take. Proper treatment helps prevent serious complications like stroke, heart attack, and kidney disease. Self-medication may hide symptoms and delay correct treatment, making these complications more likely.",
  },
];

export default function MedicalSelf() {
  const router = useRouter();

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const speak = (text: string, isDoctor = false) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: isDoctor ? 1.2 : 0.6, language: 'en-IN' });
  };

  return (
    <ImageBackground source={require("@/assets/images/medical.png")} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.3 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Self Medication</Text>
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
                  {scene.overlayImg && (
                    <Image source={scene.overlayImg} style={styles.overlayImg} />
                  )}
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
  sceneImage: { width: 80, height: 130, resizeMode: 'contain' },
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
  overlayImg: {
    width: 80,
    height: 80,
    position: "absolute",
    right: -10,
    bottom: -30,
    opacity: 0.85,
    resizeMode: "contain",
  },
});
