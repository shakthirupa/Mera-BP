import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

export default function MedicalMeasure() {
  const router = useRouter();

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = (text: string, isDoctor = false) => {
    Speech.stop();
    Speech.speak(text, { 
      rate: 0.9, 
      pitch: 1.2,
      language: 'en-IN'
    });
  };

  return (
    <ImageBackground source={require("@/assets/images/medical.png")} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.3 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Measure Your BP Adherence</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1pf.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What if I miss my dose today — should I take double tomorrow?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"What if I miss my dose today — should I take double tomorrow?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Never double the dose unless advised. If you remember within the same day, take it. Otherwise continue the next scheduled dose.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Never double the dose unless advised. If you remember within the same day, take it. Otherwise continue the next scheduled dose."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1df.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2pf.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Is it okay to skip medicines when BP becomes normal?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"Is it okay to skip medicines when BP becomes normal?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("No. Normal BP usually means medicines are working. Skipping them may cause BP to rise again.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"No. Normal BP usually means medicines are working. Skipping them may cause BP to rise again."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2df.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3pf.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("I take many medicines. How can I manage them better?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"I take many medicines. How can I manage them better?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("You can: Use pill boxes, Set phone alarms, Link medicines to daily routines, Ask family members to remind you, Ask your doctor about single-pill combinations.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"You can:"</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Use pill boxes, Set phone alarms, Link medicines to daily routines, Ask family members to remind you, Ask your doctor about single-pill combinations."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3df.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene4pf.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Can lifestyle changes replace BP medicines?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"Can lifestyle changes replace BP medicines?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("A healthy lifestyle helps a lot, but many patients need both lifestyle changes and medicines.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"A healthy lifestyle helps a lot, but many patients need both lifestyle changes and medicines."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene4df.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene5pf.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What should I do if I cannot afford medicines?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"What should I do if I cannot afford medicines?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Speak to your doctor. Options include: Low-cost generics, Government supply, Combination pills, Free medicines available at nearby Ayushman Arogya Mandir.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Speak to your doctor. Options include:"</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Low-cost generics, Government supply, Combination pills, Free medicines available at nearby Ayushman Arogya Mandir."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene5df.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene6pf.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("How often should I monitor my BP?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"How often should I monitor my BP?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Regular monitoring and follow-up visits help us ensure your BP is controlled and medicines are working properly.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Regular monitoring and follow-up visits help us ensure your BP is controlled and medicines are working properly."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene6df.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, padding: 20, paddingBottom: 40 },
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
  card: { backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  bullet: { fontSize: 15, lineHeight: 26, color: "#374151", marginBottom: 16 },
  sceneDivider: {
    alignItems: "center",
    marginBottom: 15,
  },
  scene: {
    marginBottom: 32,
  },
  chat: {
    gap: 16,
  },
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
