import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FeedbackScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!message) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    Alert.alert("Success", "Thank you for your feedback! We'll get back to you soon.");
    router.back();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <Ionicons
          name={index < rating ? "star" : "star-outline"}
          size={32}
          color="#F59E0B"
          style={{ marginHorizontal: 4 }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/bb.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feedback</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Feedback Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>We'd love to hear from you!</Text>
          <Text style={styles.formSubtitle}>Your feedback helps us improve Mera BP</Text>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.label}>Rate your experience</Text>
            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
          </View>

          {/* Subject Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Enter subject (optional)"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Message Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us about your experience, suggestions, or report any issues..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Send Feedback</Text>
          </TouchableOpacity>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Other ways to reach us:</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={16} color="#2563EB" />
              <Text style={styles.contactText}>support@merabp.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={16} color="#2563EB" />
              <Text style={styles.contactText}>+91 98765 43210</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  ratingSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 120,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  contactInfo: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
