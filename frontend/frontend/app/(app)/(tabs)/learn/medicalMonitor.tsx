import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

export default function MedicalMonitor() {
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
            <Text style={styles.title}>Monitor Your Medication</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1pmbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Why is it so important to take my BP medicines regularly?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"Why is it so important to take my BP medicines regularly?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Taking your medications exactly as prescribed helps control your blood pressure effectively. It also delays or prevents serious complications like heart disease, stroke, and kidney problems.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Taking your medications exactly as prescribed helps control your blood pressure effectively."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"It also delays or prevents serious complications like heart disease, stroke, and kidney problems."</Text>
                <Image source={require("@/assets/images/medicall.png")} style={styles.overlayImage} />
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1dmbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2pmbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Can I change the dose if I feel my BP is normal?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"Can I change the dose if I feel my BP is normal?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("No. Treatment should only be started or modified by a registered medical practitioner. Even if your BP seems controlled, it is because of regular medication and lifestyle changes. Never adjust doses on your own.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"No. Treatment should only be started or modified by a registered medical practitioner."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Even if your BP seems controlled, it is because of regular medication and lifestyle changes. Never adjust doses on your own."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2dmbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3pmbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What if I feel fine? Can I stop the medicine?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"What if I feel fine? Can I stop the medicine?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("No. Many people feel their BP is controlled and stop medicines — that is a common mistake. Always consult your doctor before stopping any medication.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"No. Many people feel their BP is controlled and stop medicines — that is a common mistake."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Always consult your doctor before stopping any medication."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3dmbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene4pmbp.png")} style={styles.sceneImageRect} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Should I continue medicines during follow-up visits?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"Should I continue medicines during follow-up visits?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Yes. Keep taking all your prescribed medicines during follow-up visits unless your doctor specifically tells you otherwise.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Yes. Keep taking all your prescribed medicines during follow-up visits unless your doctor specifically tells you otherwise."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene4dmbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene5pmbp.png")} style={styles.sceneImageSmall} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What happens if I miss one dose? Should I panic?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"What happens if I miss one dose? Should I panic?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("There is no need to worry if you miss one dose occasionally. Just try to be as regular as possible. Do not double the dose unless your doctor advises you to.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"There is no need to worry if you miss one dose occasionally. Just try to be as regular as possible."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Do not double the dose unless your doctor advises you to."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene5dmbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}></View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1pmbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("So the key is consistency?")}>
                <Text style={styles.patientLabel}>👤 Patient:</Text>
                <Text style={styles.chatText}>"So the key is consistency?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Exactly. Regular medication, healthy lifestyle habits, and routine check-ups together help you live better and manage hypertension safely.", true)}>
                <Text style={styles.doctorLabel}>👩⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Exactly. Regular medication, healthy lifestyle habits, and routine check-ups together help you live better and manage hypertension safely."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1dmbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  intro: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 12,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 12,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginTop: 6,
    marginBottom: 4,
  },
  drugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginTop: 8,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginTop: 4,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 3,
  },
  goodBullet: {
    fontSize: 14,
    color: "#059669",
    lineHeight: 22,
    marginBottom: 3,
  },
  badBullet: {
    fontSize: 14,
    color: "#DC2626",
    lineHeight: 22,
    marginBottom: 3,
  },
  recBullet: {
    fontSize: 14,
    color: "#2563EB",
    lineHeight: 22,
    marginBottom: 3,
  },
  highlight: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 3,
  },
  warning: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: "600",
  },
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
  sceneImage: {
    width: 130,
    height: 130,
  },
  sceneImageRect: {
    width: 140,
    height: 140,
  },
  sceneImageSmall: {
    width: 140,
    height: 140,
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
  overlayImage: {
    width: 80,
    height: 80,
    position: "absolute",
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
});
