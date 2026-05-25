import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect } from 'react';

export default function WeightCaloric() {
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
      pitch: isDoctor ? 0.6 : 1.2,
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
            <Text style={styles.headerTitle}>Caloric Balance</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What does calorie balance mean?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"What does 'calorie balance' mean?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Calorie balance means the energy you get from food is equal to the energy your body uses every day. If both are equal, your weight stays the same. If you eat more than your body uses, you gain weight. If you eat less than your body uses, you lose weight.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Calorie balance means the energy you get from food is equal to the energy your body uses every day."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"If both are equal, your weight stays the same. If you eat more than your body uses, you gain weight. If you eat less than your body uses, you lose weight."</Text>
                <Image source={require("@/assets/images/cal.png")} style={styles.overlayImage} />
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("How does eating extra calories cause weight gain?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"How does eating extra calories cause weight gain?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("When you regularly eat more than your body needs, the extra energy gets stored as body fat. Even small extra amounts every day can slowly increase your weight over months or years. That's how gradual weight gain usually happens.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"When you regularly eat more than your body needs, the extra energy gets stored as body fat."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Even small extra amounts every day can slowly increase your weight over months or years. That's how gradual weight gain usually happens."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("So if I want to lose weight, do I just need to eat less?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"So if I want to lose weight, do I just need to eat less?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Eating a little less helps, but it's not the whole story. Your body adjusts when you cut down food—it may make you feel hungrier and slow down how many calories you burn. That's why weight loss works best when healthy eating is combined with regular physical activity.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Eating a little less helps, but it's not the whole story. Your body adjusts when you cut down food—it may make you feel hungrier and slow down how many calories you burn."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"That's why weight loss works best when healthy eating is combined with regular physical activity."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene4monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Is counting calories enough for healthy weight loss?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"Is counting calories enough for healthy weight loss?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Counting calories can help, but what you eat is just as important as how much you eat. Your body needs enough protein and healthy nutrients to stay strong. Losing weight in a healthy way means losing fat while keeping your muscles strong.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Counting calories can help, but what you eat is just as important as how much you eat."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Your body needs enough protein and healthy nutrients to stay strong. Losing weight in a healthy way means losing fat while keeping your muscles strong."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene4mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What is more important — calories or nutrients?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"What is more important — calories or nutrients?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Both matter. Calories affect your weight, but nutrients affect your health. For example, eating enough protein helps protect your muscles while you lose weight. So instead of focusing only on numbers, think about eating balanced, healthy meals.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Both matter. Calories affect your weight, but nutrients affect your health."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"For example, eating enough protein helps protect your muscles while you lose weight. So instead of focusing only on numbers, think about eating balanced, healthy meals."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("How does exercise help with calorie balance?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"How does exercise help with calorie balance?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Exercise helps your body use more energy. When you move more, your body burns more calories. People who are active find it easier to control their weight because their bodies balance food intake and energy use better than when they are inactive.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Exercise helps your body use more energy. When you move more, your body burns more calories."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"People who are active find it easier to control their weight because their bodies balance food intake and energy use better than when they are inactive."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene3monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Do I need to make big changes to see results?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"Do I need to make big changes to see results?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Not always. Even small daily changes can make a big difference over time. For example, walking a little more and eating slightly smaller portions can prevent weight gain. Small changes are easier to continue for a long time.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Not always. Even small daily changes can make a big difference over time."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"For example, walking a little more and eating slightly smaller portions can prevent weight gain. Small changes are easier to continue for a long time."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene3mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene4monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("Why do people regain weight after losing it?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"Why do people regain weight after losing it?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("After weight loss, your body needs fewer calories than before. At the same time, you may feel hungrier. This makes it easy to regain weight unless healthy habits are continued. That's why long-term lifestyle changes are more important than short-term dieting.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"After weight loss, your body needs fewer calories than before. At the same time, you may feel hungrier."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"This makes it easy to regain weight unless healthy habits are continued. That's why long-term lifestyle changes are more important than short-term dieting."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene4mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene1monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("How can calorie balance help with high blood pressure?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"How can calorie balance help with high blood pressure?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("Extra body weight puts extra strain on your heart and blood vessels. This can raise blood pressure. When you maintain a healthy weight through balanced eating and regular activity, your blood pressure often improves too.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"Extra body weight puts extra strain on your heart and blood vessels. This can raise blood pressure."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"When you maintain a healthy weight through balanced eating and regular activity, your blood pressure often improves too."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene1mondbp.png")} style={styles.sceneImage} />
            </View>
          </View>
        </View>

        <View style={styles.scene}>
          <View style={styles.chat}>
            <View style={styles.patientRow}>
              <Image source={require("@/assets/images/scene2monpbp.png")} style={styles.sceneImage} />
              <TouchableOpacity style={styles.patientBubble} onPress={() => speak("What is the safest way to manage weight and blood pressure?")}>
                <Text style={styles.patientLabel}>👨🏻 Patient:</Text>
                <Text style={styles.chatText}>"What is the safest way to manage weight and blood pressure?"</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.doctorRow}>
              <TouchableOpacity style={styles.doctorBubble} onPress={() => speak("The safest way is steady and balanced. Eat healthy meals with enough protein and vegetables, control portion sizes, and stay physically active most days of the week. Avoid extreme dieting. Slow, steady changes are better for your heart and overall health.", true)}>
                <Text style={styles.doctorLabel}>👩🏻‍⚕️ Doctor:</Text>
                <Text style={styles.chatText}>"The safest way is steady and balanced. Eat healthy meals with enough protein and vegetables, control portion sizes, and stay physically active most days of the week."</Text>
                <Text style={[styles.chatText, {marginTop: 12}]}>"Avoid extreme dieting. Slow, steady changes are better for your heart and overall health."</Text>
              </TouchableOpacity>
              <Image source={require("@/assets/images/scene2mondbp.png")} style={styles.sceneImage} />
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
  overlayImage: {
    position: "absolute",
    right: -120,
    bottom: 5,
    width: 100,
    height: 100,
    opacity: 0.8,
  },
});
