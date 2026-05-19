import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

export default function WeightDiet() {
  const router = useRouter();

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = (text, isDoctor = false) => {
    Speech.stop();
    Speech.speak(text, { 
      rate: 0.9, 
      pitch: isDoctor ? 1.2 : 0.6,
      language: 'en-IN'
    });
  };

  return (
    <ImageBackground source={require("@/assets/images/we.png")} style={styles.background} resizeMode="cover" imageStyle={{ opacity: 0.3 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Weight Reduction Diet</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Doctor, how useful is weight reduction in managing hypertension?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"Doctor, how useful is weight reduction in managing hypertension?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Weight reduction appears to be an effective first-line therapy for approximately 50% of obese patients with mild to moderate hypertension.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Weight reduction appears to be an effective first-line therapy for approximately 50% of obese patients with mild to moderate hypertension."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Does weight loss really reduce blood pressure?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"Does weight loss really reduce blood pressure?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Yes. The mean fall in systolic blood pressure was 11 mmHg for all dieting hypertensive patients. And the mean fall in diastolic blood pressure was 7 mmHg for dieting patients.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Yes. The mean fall in systolic blood pressure was 11 mmHg for all dieting hypertensive patients."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"And the mean fall in diastolic blood pressure was 7 mmHg for dieting patients."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("How much weight did patients lose?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"How much weight did patients lose?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("The mean weight loss during the six months of the study was 6.5 kg for all the dieting hypertensive patients.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"The mean weight loss during the six months of the study was 6.5 kg for all the dieting hypertensive patients."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene4spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What kind of diet should I follow for weight reduction?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"What kind of diet should I follow for weight reduction?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("You should focus on: Reduction of fat, sugar and salt in diet. Reduction of simple and refined carbohydrate. Complete avoidance of trans-fat. Limiting foods high in saturated fat, such as fatty meats, full-fat dairy, and tropical oils. Limiting sugar-sweetened beverages and sweets. To be as close to nature as possible in everything including diet.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"You should focus on:"</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>● Reduction of fat, sugar and salt (sodium) in diet</Text>
                <Text style={styles.chatText}>● Reduction of simple and/or refined carbohydrate in diet</Text>
                <Text style={styles.chatText}>● Completely avoidance of trans-fat</Text>
                <Text style={styles.chatText}>● Limiting foods that are high in saturated fat, such as fatty meats, full-fat dairy products, and tropical oils such as coconut, palm kernel, and palm oils</Text>
                <Text style={styles.chatText}>● Limiting sugar-sweetened beverages and sweets</Text>
                <Text style={styles.chatText}>● To be as close to nature as possible in everything including diet</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene4sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Why is weight reduction so important for blood pressure?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"Why is weight reduction so important for blood pressure?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Because an increase in weight requires heart to work extra to pump blood into an overweight body, hence blood pressure has to increase significantly to maintain this supply.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Because an increase in weight requires heart to work extra to pump blood into an overweight body, hence blood pressure has to increase significantly to maintain this supply."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Will the benefits last long term?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"Will the benefits last long term?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Yes. The early changes achieved in both weight and blood pressure were maintained.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Yes. The early changes achieved in both weight and blood pressure were maintained."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3spbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Does high blood pressure motivate patients to lose weight?")}>
                <Text style={styles.patientLabel}>👴 Old Man:</Text>
                <Text style={styles.chatText}>"Does high blood pressure motivate patients to lose weight?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Yes. Raised blood pressure appears to provide motivation for such patients to attend a dietitian's clinic and to lose weight.", true)}>
                <Text style={styles.doctorLabel}>👨⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Yes. Raised blood pressure appears to provide motivation for such patients to attend a dietitian's clinic and to lose weight."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3sdbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#000", marginLeft: 8 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  scene: {
    marginBottom: 32,
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginLeft: 20,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginRight: 20,
  },
  sceneImage: { width: 120, height: 120, resizeMode: "contain" },
  chat: {
    gap: 16,
  },
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
    position: "relative",
  },
  patientLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 6,
  },
  doctorLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 6,
  },
  chatText: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 26,
    fontWeight: "500",
  },
});
