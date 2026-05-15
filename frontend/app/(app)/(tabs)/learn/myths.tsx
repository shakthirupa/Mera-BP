import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const mythsData = [
  {
    myth: "I feel fine. How can I have hypertension?",
    fact: "Hypertension, or high blood pressure, is often called the silent killer because it usually has no symptoms. Even without symptoms, high blood pressure damages your blood vessels, heart, kidneys and other organs.",
  },
  {
    myth: "High blood pressure is not a serious problem.",
    fact: "High blood pressure is the world's leading killer. Unless treated, it can cause stroke, heart attack, kidney failure, dementia and many other serious health problems.",
  },
  {
    myth: "I am young. I cannot have hypertension.",
    fact: "You can develop high blood pressure at any age. Risk of hypertension increases as you get older. These days, more and more young people have high blood pressure, and hence need to be screened.",
  },
  {
    myth: "High blood pressure runs in my family. I can do nothing to prevent it.",
    fact: "If your parents or close relatives have high blood pressure, you can develop it, too. You can help prevent high blood pressure by having a healthy lifestyle.",
  },
  {
    myth: "I have hypertension but I do not like taking medicines as they cause side effects.",
    fact: "Untreated hypertension is more dangerous than the side effects caused by medicines. There are many effective and safe medications to control high blood pressure. If one medication causes side effects, your doctor can change prescription to a different one.",
  },
  {
    myth: "My BP is fine if it is less than my age+100",
    fact: "The ideal blood pressure is lower than 120/80mmHg, and high blood pressure is 140/90 mmHg or higher, regardless of your age. The lower your blood pressure the lower your risk of heart attack, heart failure, stroke and kidney disease will be.",
  },
  {
    myth: "Lifestyle management will cure hypertension.",
    fact: "Lifestyle management is important and can help prevent or manage hypertension. Lifestyle management, however, should complement treatment with medication, NOT substitute it.",
  },
  {
    myth: "My blood pressure is under 140/90 mm Hg, I can stop medication.",
    fact: "DO NOT stop medication on your own! Always seek your doctor's advice. You will have to take a medicine every day for the rest of your life. Medication can get blood pressure under control, but stopping medication will likely cause blood pressure to rise again.",
  },
  {
    myth: "I don't need to check my blood pressure regularly.",
    fact: "Having your blood pressure checked regularly is very important, especially if you have been diagnosed with high blood pressure at any time in the past. Keep a note of your blood pressure readings to make sure your blood pressure is under 140/90 mm Hg.",
  },
  {
    myth: "I don't use table salt, so I cannot have high blood pressure.",
    fact: "You may not be adding extra salt to your cooked food, but food already contains sodium. Salt intake increases blood pressure—no matter what the source. Processed and packaged foods such as pickles and papads contain high level of salt.",
  },
];

export default function MythsFacts() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/bb.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="bulb" size={24} color="#F59E0B" />
          <Text style={styles.headerTitle}>Myths & Facts</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {mythsData.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            <View style={styles.mythBox}>
              <Text style={styles.mythTitle}>MYTH</Text>
              <Text style={styles.mythText}>{item.myth}</Text>
            </View>
            <View style={styles.factBox}>
              <Text style={styles.factTitle}>FACT</Text>
              <Text style={styles.factText}>{item.fact}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  content: { flex: 1, padding: 16 },
  cardContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mythBox: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 18,
    justifyContent: "center",
  },
  factBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 18,
    justifyContent: "center",
  },
  mythTitle: { color: "#FEF3C7", fontWeight: "800", fontSize: 11, letterSpacing: 1, marginBottom: 8 },
  mythText: { color: "#FFFFFF", fontSize: 14, lineHeight: 22, fontWeight: "500" },
  factTitle: { color: "#2563EB", fontWeight: "800", fontSize: 11, letterSpacing: 1, marginBottom: 8 },
  factText: { color: "#1E293B", fontSize: 14, lineHeight: 22, fontWeight: "500" },
});
