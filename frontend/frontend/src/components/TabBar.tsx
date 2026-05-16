import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TabBar({activeTab} : {activeTab: string}) {
  const router = useRouter();

  const handleTabPress = (tabName : string) => {
    if (tabName === "Learn") {
      router.push('/learn');
    } else if (tabName === "Chatbot") {
      router.push('/chatbot');
    } else if (tabName === "Profile") {
      router.push('/profile');
    }
  };

  return (
    <View style={styles.navBar}>
      {/* Learn Tab */}
      <Pressable
        style={styles.navItem}
        onPress={() => handleTabPress("Learn")}
      >
        <Ionicons
          name="book-outline"
          size={20}
          color={activeTab === "Learn" ? "#2563EB" : "#94A3B8"}
        />
        <Text
          style={[
            styles.navText,
            { color: activeTab === "Learn" ? "#2563EB" : "#94A3B8" },
          ]}
        >
          Learn
        </Text>
      </Pressable>

      {/* Chatbot Tab */}
      <Pressable
        style={[styles.navItem, styles.chatbotTab]}
        onPress={() => handleTabPress("Chatbot")}
      >
        <View style={[
          styles.chatbotIconContainer, 
          { 
            backgroundColor: activeTab === "Chatbot" ? "#10B981" : "#2563EB",
            shadowColor: activeTab === "Chatbot" ? "#10B981" : "#2563EB"
          }
        ]}>
          <Ionicons
            name="chatbubble"
            size={20}
            color="#FFFFFF"
          />
        </View>
        <Text
          style={[
            styles.navText,
            styles.chatbotText,
            { color: activeTab === "Chatbot" ? "#10B981" : "#2563EB" },
          ]}
        >
          Bandhu
        </Text>
      </Pressable>

      {/* Profile Tab */}
      <Pressable
        style={styles.navItem}
        onPress={() => handleTabPress("Profile")}
      >
        <Ionicons
          name="person-outline"
          size={20}
          color={activeTab === "Profile" ? "#2563EB" : "#94A3B8"}
        />
        <Text
          style={[
            styles.navText,
            { color: activeTab === "Profile" ? "#2563EB" : "#94A3B8" },
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  navText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },

  chatbotTab: {
    transform: [{ scale: 1.1 }],
  },

  chatbotIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  chatbotText: {
    fontWeight: "700",
    fontSize: 10,
  },

})