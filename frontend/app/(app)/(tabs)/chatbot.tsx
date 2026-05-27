import { API } from "@/src/constants/api";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id:      string;
  role:    "user" | "assistant";
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "What does my latest BP reading mean?",
  "How can I lower my blood pressure naturally?",
  "What foods should I avoid with hypertension?",
  "Are my current medications normal for hypertension?",
  "What is a normal resting heart rate?",
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const listRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const token    = await getAccessToken();
      const response = await fetch(API.CHAT, {
        method:  "POST",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: updated
            .slice(0, -1)          // exclude the message just sent
            .slice(-6)             // last 3 turns (3 user + 3 assistant)
            .map(m => ({ role: m.role, content: m.content.slice(0, 400) }))
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to get response");

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.message },
      ]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id:      (Date.now() + 1).toString(),
          role:    "assistant",
          content: "Sorry, I couldn't process that. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

const renderMessage = ({ item }: { item: Message }) => {
  const isUser = item.role === "user";
  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="pulse" size={16} color="#2563EB" />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {item.content}
        </Text>
      </View>
    </View>
  );
};

  return (
    <ImageBackground
      source={require("@/assets/images/bb.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Bandhu</Text>
          </View>
        </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyAvatarLarge}>
                <Ionicons name="pulse" size={36} color="#2563EB" />
              </View>
              <Text style={styles.emptyTitle}>
                Hi! I'm <Text style={{color:"#2563EB"}}>Bandhu</Text>, your hypertension assistant
              </Text>

              <Text style={styles.emptySubtitle}>
                Feel free to ask about your blood pressure, medications, 
                or hypertension management. I can also help analyze your health data.
              </Text>
              <View style={styles.suggestions}>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestionChip}
                    onPress={() => sendMessage(q)}
                  >
                    <Text style={styles.suggestionText}>{q}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#2563EB" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          }
        />

        {/* Typing indicator */}
        {loading && (
          <View style={styles.typingRow}>
            <View style={styles.botAvatar}>
              <Ionicons name="pulse" size={16} color="#2563EB" />
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your health..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>


      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backgroundImage:    { flex: 1 },
  flex:               { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 14,
    gap: 20,
  },
  headerTitle:      { fontSize: 18, fontWeight: "600", color: "#0F172A" },
  messageList:        { flex: 1 },
  messageListContent: { padding: 20, paddingBottom: 8 },
bubbleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20, gap: 8 },  bubbleRowUser:      { flexDirection: "row-reverse" },
  botAvatar:          { width: 30, height: 30, borderRadius: 10, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center", marginBottom: 2 },
  bubble:             { maxWidth: "80%", borderRadius: 18, padding: 12 },
  bubbleBot:          { backgroundColor: "#fff", borderTopLeftRadius: 4,  borderWidth: 0.5, borderColor: "#E5E7EB"},
  bubbleUser:         { backgroundColor: "#2563EB", borderBottomRightRadius: 4 },
  bubbleText:         { fontSize: 15, color: "#111827", lineHeight: 22 },
  bubbleTextUser:     { color: "#FFFFFF" },
  typingRow:          { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  typingBubble:       { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.97)", borderRadius: 18, padding: 12, borderBottomLeftRadius: 4 },
  typingText:         { fontSize: 13, color: "#6B7280" },
  emptyState:         { alignItems: "center", paddingTop: 48, paddingHorizontal: 16 },
  emptyAvatarLarge:   { width: 80, height: 80, borderRadius: 24, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle:         { fontSize: 18, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 8 },
  emptySubtitle:      { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 21, marginBottom: 28 },
  suggestions:        { width: "100%", gap: 10 },
  suggestionChip:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.95)", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 14 },
  suggestionText:     { fontSize: 14, color: "#2563EB", fontWeight: "500", flex: 1 },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: 20, paddingTop: 10 },
  input:              { flex: 1, backgroundColor: "#fff", borderRadius: 26, paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, color: "#111827", maxHeight: 100, borderWidth: 1, borderColor: "#E5E7EB" },
  sendBtn:            { width: 44, height: 44, borderRadius: 22, backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center" },
  sendBtnDisabled:    { opacity: 0.5 },

});
