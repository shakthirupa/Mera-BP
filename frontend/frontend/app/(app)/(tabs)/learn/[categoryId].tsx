// app/learn/[categoryId].tsx
import { getCategoryById, type CategorySection } from "@/src/data/learnCategories";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();

  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorBack}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/bh.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
    >
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{category.title}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {category.sections.map((section: CategorySection) => (
          <InfoSection key={section.id} {...section} />
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const DIRECT_ROUTES: Record<string, string> = {
  "medication-monitor":    "/(app)/(tabs)/learn/medicalMonitor",
  "medication-pill-count": "/(app)/(tabs)/learn/medicalPillCount",
  "medication-measure":    "/(app)/(tabs)/learn/medicalMeasure",
  "medication-self":       "/(app)/(tabs)/learn/medicalSelf",
  "weight-caloric":        "/(app)/(tabs)/learn/weightCaloric",
  "weight-diet":           "/(app)/(tabs)/learn/weightDiet",
  "weight-exercise":       "/(app)/(tabs)/learn/weightExercise",
  "weight-lifestyle":      "/(app)/(tabs)/learn/weightLifestyle",
  "myth-symptoms":         "/(app)/(tabs)/learn/myths",
  "myth-young":            "/(app)/(tabs)/learn/myths",
  "myth-cured":            "/(app)/(tabs)/learn/myths",
  "myth-medication-stop":  "/(app)/(tabs)/learn/myths",
};

function InfoSection({ icon, title, content, topicId }: CategorySection) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.infoCard}
      onPress={() => {
        const direct = DIRECT_ROUTES[topicId];
        if (direct) {
          router.push(direct as any);
        } else {
          router.push({
            pathname: "/learn/topic/[topicId]",
            params: { topicId },
          });
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.infoHeader}>
        <Ionicons name={icon as any} size={22} color="#2563EB" />
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoContent}>{content}</Text>
      <Text style={styles.readMore}>Read more</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#374151" },
  errorBack: { color: "#2563EB", marginTop: 12 },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    paddingLeft: 15,
    paddingRight: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  infoContent: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 24,
    marginTop: 8,
    paddingLeft: 32,
  },
  readMore: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2563EB",
    marginTop: 8,
    paddingLeft: 32,
  },
});