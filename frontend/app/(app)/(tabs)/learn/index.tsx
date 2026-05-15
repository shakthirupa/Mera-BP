// app/learn/index.tsx
import TabBar from "@/src/components/TabBar";
import { learnCards, type LearnCard } from "@/src/data/learnCards";
import { useAuth } from "@/src/providers/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Learn() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(getTimeGreeting());

  useFocusEffect(
    useCallback(() => {
      setGreeting(getTimeGreeting());
    }, [])
  );

  const activeTab = pathname.includes("main")
    ? "Learn"
    : pathname.includes("chatbot")
    ? "Chatbot"
    : pathname.includes("profile")
    ? "Profile"
    : "Learn";

  return (
    <ImageBackground
      source={require("@/assets/images/back.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={styles.nameText}>
                {greeting + "! " + user?.name}
              </Text>
            </View>

            <Text style={styles.title}>Learn & Manage</Text>

            {learnCards.map((card: LearnCard) => (
              <Card
                key={card.id}
                icon={card.icon}
                bg={card.bg}
                title={card.title}
                subtitle={card.subtitle}
                onPress={() =>
                  card.id === "myths"
                    ? router.push("/(app)/(tabs)/learn/myths" as any)
                    : router.push({
                        pathname: "/learn/[categoryId]",
                        params: { categoryId: card.id },
                      })
                }
              />
            ))}
          </View>
        </ScrollView>

        <TabBar activeTab={activeTab} />
      </View>
    </ImageBackground>
  );
}

function Card({
  icon,
  bg,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  bg: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={22} color="#2563EB" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  mainContainer: { flex: 1, marginTop: 40 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  content: { padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginVertical: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#0F172A" },
  cardSubtitle: { fontSize: 13, color: "#64748B", marginTop: 2 },
});
