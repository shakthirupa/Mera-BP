import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BPDetail() {
  const router = useRouter();

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = (text: string, isDoctor = false) => {
    Speech.stop();
    Speech.speak(text, { 
      rate: 1, 
      pitch: isDoctor ? 1 : 0.6,
      language: 'en-IN'
    });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bh.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >

        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>What is Blood Pressure?</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.sceneDivider}>
        </View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1pbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Doctor, what is blood pressure?")}>
                <Text style={styles.patientLabel}>Patient:</Text>
                <Text style={styles.chatText}>"Doctor, what is blood pressure?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Blood pressure, is a pressure exerted by flowing blood, on the walls of our arteries. It is important, because it is the driving force, for blood to travel around the body, to deliver oxygen and nutrients, to the organs of the body.", true)}>
                <Text style={styles.doctorLabel}>Doctor:</Text>
                <Text style={styles.chatText}>"Blood pressure is a pressure exerted by flowing blood on the walls of our arteries."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"It is important because it is the driving force for blood to travel around the body to deliver oxygen and nutrients to the organs of the body."</Text>
                <Image source={require("@/assets/images/heart.png")} style={styles.absoluteImage} />
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1dbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}>
        </View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2pbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("I see two numbers in my report. What do they mean?")}>
                <Text style={styles.patientLabel}>Patient:</Text>
                <Text style={styles.chatText}>"I see two numbers in my report. What do they mean?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Systolic Blood Pressure, upper BP reading, is a result of Cardiac Activity, Active Cardiac Pumping. Diastolic pressure, lower BP reading, indicates pressure maintained in arteries, even as heart relaxes between beats.", true)}>
                <Text style={styles.doctorLabel}>Doctor:</Text>
                <Text style={styles.chatText}>"Systolic Blood Pressure (upper BP reading) is a result of Cardiac Activity (Active Cardiac Pumping)."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Diastolic pressure (lower BP reading) indicates pressure maintained in arteries even as heart relaxes between beats."</Text>
                <Image source={require("@/assets/images/sysdias.png")} style={styles.absoluteImage} />
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2dbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}>
        </View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3pbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What is considered normal?")}>
                <Text style={styles.patientLabel}>Patient:</Text>
                <Text style={styles.chatText}>"What is considered normal?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("The generally accepted level for normal blood pressure is, less than 130 mm Hg for systolic, and less than 85 mm Hg diastolic.", true)}>
                <Text style={styles.doctorLabel}>Doctor:</Text>
                <Text style={styles.chatText}>"The generally accepted level for normal blood pressure is &lt; 130 mm Hg for systolic, and &lt; 85 mm Hg diastolic."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3dbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}>
        </View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRowScene4}>
              <Image source={require("@/assets/images/scene4pbp.png")} style={styles.sceneImageRect} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Does blood pressure remain the same all the time?")}>
                <Text style={styles.patientLabel}>Patient:</Text>
                <Text style={styles.chatText}>"Does blood pressure remain the same all the time?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Blood pressure never remains constant. It varies from beat to beat. Blood pressure variation, can be normal, or abnormal.", true)}>
                <Text style={styles.doctorLabel}>Doctor:</Text>
                <Text style={styles.chatText}>"Blood pressure never remains constant, it varies from beat to beat."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Blood pressure variation can be normal or abnormal."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene4dbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.sceneDivider}>
        </View>
        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRowLast}>
              <Image source={require("@/assets/images/scene5pbp.png")} style={styles.sceneImageSmall} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("When does it change?")}>
                <Text style={styles.patientLabel}>Patient:</Text>
                <Text style={styles.chatText}>"When does it change?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Such variation can be physiological, such as during sleep, food, post-meals, physical activity and exercise, stress, etc. It may also be pathological, due to disease conditions of kidney, heart, endocrine system. Blood pressure may also be affected by changes in posture, advancing age, or by volume of blood in circulation, such as in dehydration.", true)}>
                <Text style={styles.doctorLabel}>Doctor:</Text>
                <Text style={styles.chatText}>"Such variation can be physiological such as during sleep, food (post-meals), physical activity and exercise, stress, etc."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"It may also be pathological due to disease conditions of kidney, heart, endocrine system."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Blood pressure may also be affected by changes in posture, advancing age, or by volume of blood in circulation such as in dehydration."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene5dbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
    paddingVertical: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginLeft: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sceneDivider: {
    alignItems: "center",
    marginBottom: 15,
  },
  sceneText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
    letterSpacing: 1,
  },
  scene: {
    marginBottom: 32,
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  patientRowScene4: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  patientRowLast: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sceneImage: {
    width: 120,
    height: 120,
  },
  sceneImageRect: {
    width: 120,
    height: 120,
  },
  sceneImageSmall: {
    width: 120,
    height: 120,
  },
  chat: {
    gap: 16,
  },
  patientBubble: {
    backgroundColor: "rgb(238, 245, 255)",
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
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
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
  absoluteImage: {
    width: 90,
    height: 90,
    position: "absolute",
    right: -50,
    bottom: -10,
    opacity: 1,
  },
});
