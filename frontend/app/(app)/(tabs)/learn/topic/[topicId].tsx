// app/learn/topic/[topicId].tsx
import { getTopicById, type Scene } from "@/src/data/healthTopics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();

  const topic = getTopicById(topicId);

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
      language: "en-IN",
    });
  };

  if (!topic) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Topic not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorBack}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
      source={topic.backgroundImage}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{topic.title}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {topic.scenes.map((scene: Scene) => (
          <View key={scene.id}>
            <View style={styles.sceneDivider} />
            <View style={styles.scene}>
              <View style={styles.chat}>

                {/* Patient row */}
                <View style={styles.patientRow}>
                  <Image source={scene.patientImage} style={styles.sceneImage} />
                  <TouchableOpacity
                    style={styles.patientBubble}
                    onPress={() => speak(scene.patientSpeech)}
                  >
                    <Text style={styles.patientLabel}>Patient:</Text>
                    <Text style={styles.chatText}>"{scene.patientText}"</Text>
                  </TouchableOpacity>
                </View>

                {/* Doctor row */}
                <View style={styles.doctorRow}>
                  <TouchableOpacity
                    style={styles.doctorBubble}
                    onPress={() => speak(scene.doctorSpeech, true)}
                  >
                    <Text style={styles.doctorLabel}>Doctor:</Text>
                    {scene.doctorLines.map((line, i) => (
                      <Text
                        key={i}
                        style={[styles.chatText, i > 0 && { marginTop: 12 }]}
                      >
                        "{line}"
                      </Text>
                    ))}
                    {scene.decorImage && (
                      <Image
                        source={scene.decorImage}
                        style={styles.absoluteImage}
                      />
                    )}
                  </TouchableOpacity>
                  <Image source={scene.doctorImage} style={styles.sceneImage} />
                </View>

              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, padding: 20 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#374151" },
  errorBack: { color: "#2563EB", marginTop: 12 },
  header: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#000", marginLeft: 8 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  sceneDivider: { alignItems: "center", marginBottom: 15 },
  scene: { marginBottom: 32 },
  doctorRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  patientRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  sceneImage: { width: 120, height: 120 },
  chat: { gap: 16 },
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
  patientLabel: { fontSize: 14, fontWeight: "700", color: "#2563EB", marginBottom: 6 },
  doctorLabel: { fontSize: 14, fontWeight: "700", color: "#059669", marginBottom: 6 },
  chatText: { fontSize: 16, color: "#1F2937", lineHeight: 26, fontWeight: "500" },
  absoluteImage: {
    width: 90,
    height: 90,
    position: "absolute",
    right: -100,
    bottom: -10,
  },
});