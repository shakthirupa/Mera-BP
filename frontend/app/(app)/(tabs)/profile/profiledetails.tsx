import InlineYoutubePlayer from "@/src/components/InlineYoutubePlayer";
import { API } from "@/src/constants/api";
import { useAuth } from "@/src/providers/AuthContext";
import { deleteAccount, getProfile } from "@/src/services/api";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reminder {
  id: number;
  medicationId: number;
  medicationName: string;
  reminderTime: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "YYYY-MM-DD" → "DD MMM YYYY" for display */
const formatDob = (s?: string) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d).padStart(2,"0")} ${months[m - 1]} ${y}`;
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileDetailsScreen() {
  const { user, signOut, setUser } = useAuth();
  const router = useRouter();

  const [reminders, setReminders] = useState<Reminder[]>([]);

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setUser).catch(() => {});
      loadReminders();
    }, [])
  );

  const loadReminders = async () => {
    try {
      const token = await getAccessToken();
      const res   = await fetch(API.REMINDERS, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setReminders(await res.json());
    } catch {}
  };
  const [showVideos,    setShowVideos]    = useState(false);
  const [showContact,   setShowContact]   = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal,setShowVideoModal]= useState(false);

  const hypertensionVideos = [
    { id: 1, title: "Understanding High Blood Pressure", duration: "8:45",  youtubeId: "MiXHJCzWyAE" },
    { id: 2, title: "Diet Tips for Hypertension",        duration: "12:30", youtubeId: "6g07XT5V2uA" },
    { id: 3, title: "Exercise for Blood Pressure Control",duration: "15:20", youtubeId: "lDWKhPH0fe4" },
  ];

  const handleShare = async () => {
    try {
      await Share.share({ message: "https://play.google.com/store/apps/details?id=com.merabp.app" });
    } catch {
      Alert.alert("Error", "Unable to share");
    }
  };

  const menuItems = [
    { icon: "logo-youtube",    title: "YouTube Videos", color: "#FF0000", action: () => setShowVideos(!showVideos) },
    { icon: "chatbubble-outline", title: "Feedback",    color: "#10B981", action: () => router.push("/profile/feedback") },
    { icon: "call-outline",    title: "Contact Us",     color: "#2563EB", action: () => setShowContact(!showContact) },
    { icon: "share-outline",   title: "Share App",      color: "#993C1D", action: handleShare },
    { icon: "shield-outline",  title: "Terms & Privacy",color: "#F59E0B", action: () => router.push("/(auth)/register/policy-view" as any) },
    { icon: "information-circle-outline", title: "About the App", color: "#5da8fd", action: () => "about"}
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              await signOut();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to delete account. Please try again.");
            }
          },
        },
      ]
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <ImageBackground
      source={require("@/assets/images/bb.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* ── Profile card ──────────────────────────────────────── */}
<View style={styles.profileSection}>
  <View style={styles.profileRow}>
    <View style={styles.profileImageContainer}>
      <Text style={styles.profileInitial}>{user?.name?.charAt(0).toUpperCase()}</Text>
    </View>
    <View>
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.userEmail}>
        {user?.authProvider === 'PHONE' ? user?.phone : user?.email}
      </Text>
    </View>
  </View>
  <View style={styles.profileFooter}>
    <View style={styles.profileMeta}>
      {user?.dateOfBirth && <View style={styles.metaChip}><Text style={styles.metaChipText}>{formatDob(user.dateOfBirth)}</Text></View>}
      {user?.gender && <View style={styles.metaChip}><Text style={styles.metaChipText}>{user.gender.charAt(0) + user.gender.slice(1).toLowerCase()}</Text></View>}
    </View>
    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/editProfile')}>
      <Text style={styles.editButtonText}>Edit profile</Text>
    </TouchableOpacity>
  </View>
</View>

        {/* ── Reminders slot ────────────────────────────────────── */}
        <View style={styles.remindersSection}>
          <View style={styles.remindersSectionHeader}>
            <View style={styles.remindersIconWrap}>
              <Ionicons name="alarm" size={18} color="#2563EB" />
            </View>
            <Text style={styles.remindersSectionTitle}>Reminders</Text>
            <TouchableOpacity onPress={() => router.push("/profile/medication")}>
              <Text style={styles.remindersViewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {reminders.length === 0 ? (
            <View style={styles.remindersEmpty}>
              <Ionicons name="alarm-outline" size={28} color="#D1D5DB" />
              <Text style={styles.remindersEmptyText}>No reminders set</Text>
            </View>
          ) : (
            reminders.slice(0, 5).map((r) => (
              <View key={r.id} style={styles.reminderRow}>
                <View style={styles.reminderTimeChip}>
                  <Text style={styles.reminderTimeText}>{r.reminderTime.slice(0, 5)}</Text>
                </View>
                <Text style={styles.reminderMedName} numberOfLines={1}>{r.medicationName}</Text>
                <Ionicons name="medical" size={14} color="#9CA3AF" />
              </View>
            ))
          )}
          {reminders.length > 5 && (
            <TouchableOpacity onPress={() => router.push("/profile/medication")}>
              <Text style={styles.remindersMore}>+{reminders.length - 5} more</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Account section ───────────────────────────────────── */}
        {/* Each row needs its own OTP/verification flow — kept separate from Edit Profile */}
        <View style={styles.accountSection}>
          <Text style={styles.accountSectionTitle}>Account</Text>

          {([
            { icon: "mail-outline",       label: "Email",        value: user?.email,  route: "/profile/changeEmail",    color: "#2563EB" },
            { icon: "call-outline",       label: "Phone Number", value: user?.phone,  route: "/profile/changePhone",    color: "#10B981" },
            { icon: "lock-closed-outline",label: "Change Password",     value: "••••••••",   route: "/profile/changePassword", color: "#F59E0B" },
          ] as const).map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.accountRow, index < arr.length - 1 && styles.accountRowBorder]}
              onPress={() => item.label === "Change Password" ? router.push("/profile/changePassword" as any) : null}
              activeOpacity={0.7}
            >
              <View style={[styles.accountIcon, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <View style={styles.accountRowContent}>
                <Text style={styles.accountRowLabel}>{item.label}</Text>
                <Text style={styles.accountRowValue} numberOfLines={1}>
                  {item.value ?? "Not set"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Menu items ────────────────────────────────────────── */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.menuItem} onPress={item.action}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons
                  name={
                    item.title === "YouTube Videos" ? (showVideos  ? "chevron-up" : "chevron-down") :
                    item.title === "Contact Us"     ? (showContact ? "chevron-up" : "chevron-down") :
                    "chevron-forward"
                  }
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {/* YouTube Videos dropdown */}
              {item.title === "YouTube Videos" && showVideos && (
                <View style={styles.videosContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {hypertensionVideos.map((video) => (
                      <TouchableOpacity
                        key={video.id}
                        style={styles.videoCard}
                        onPress={() => { setSelectedVideo(video); setShowVideoModal(true); }}
                      >
                        <InlineYoutubePlayer youtubeId={video.youtubeId} />
                        <View style={styles.videoInfo}>
                          <Text style={styles.videoTitle}>{video.title}</Text>
                          <Text style={styles.videoDuration}>{video.duration}</Text>
                          <TouchableOpacity
                            style={styles.youtubeBtn}
                            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.youtubeId}`)}
                          >
                            <Ionicons name="logo-youtube" size={12} color="#FF0000" />
                            <Text style={styles.youtubeBtnText}>YouTube</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Contact Us dropdown */}
              {item.title === "Contact Us" && showContact && (
                <View style={styles.contactContainer}>
                  {[
                    { icon: "mail",     label: "Email",         value: "support@merabp.com" },
                    { icon: "call",     label: "Phone",         value: "+91 98765 43210" },
                    { icon: "location", label: "Address",       value: "123 Health Street, Medical City" },
                    { icon: "time",     label: "Support Hours", value: "Mon-Fri: 9AM-6PM" },
                  ].map((c) => (
                    <View key={c.label} style={styles.contactItem}>
                      <Ionicons name={c.icon as any} size={20} color="#2563EB" />
                      <View style={styles.contactDetails}>
                        <Text style={styles.contactLabel}>{c.label}</Text>
                        <Text style={styles.contactValue}>{c.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>


                {/* Sign Out */}
        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() =>
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: signOut },
              ]
            )
          }
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={showVideoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVideoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.centeredVideoContainer}>
            <View style={styles.videoModalHeader}>
              <TouchableOpacity onPress={() => setShowVideoModal(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            {selectedVideo && (
              <View style={styles.centeredVideoPlayer}>
                <InlineYoutubePlayer youtubeId={selectedVideo.youtubeId} isFullscreen={true} />
              </View>
            )}
            <View style={styles.videoModalInfo}>
              <Text style={styles.centeredVideoTitle}>{selectedVideo?.title}</Text>
              <Text style={styles.centeredVideoDuration}>{selectedVideo?.duration}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backgroundImage:   { flex: 1 },
  container:         { flex: 1, backgroundColor: "transparent", padding: 20 },
  header:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingVertical: 14, paddingHorizontal: 20 },
  headerTitle:       { fontSize: 20, fontWeight: "700", color: "#000" },

  // Profile card
profileSection:        { backgroundColor: "rgba(255,255,255)", borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 4, overflow: "hidden" },
profileRow:            { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 4 },
profileImageContainer: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center" },
profileInitial:        { fontSize: 24, fontWeight: "700", color: "#FFFFFF" },
userName:              { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 3 },
userEmail:             { fontSize: 13, color: "#6B7280" },
profileFooter:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTopWidth: 0, borderTopColor: "#F3F4F6" },
profileMeta:           { flexDirection: "row", gap: 8 },
metaChip:              { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
metaChipText:          { fontSize: 12, color: "#6B7280", fontWeight: "600" },
editButton:            { backgroundColor: "transparent", borderWidth: 0.5, borderColor: "#2563EB", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
editButtonText:        { color: "#2563EB", fontSize: 12, fontWeight: "600" },

  // Account section
  accountSection:       { backgroundColor: "rgba(255,255,255)", borderRadius: 20, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  accountSectionTitle:  { fontSize: 13, fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingHorizontal: 4 },
  accountRow:           { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 4, gap: 12 },
  accountRowBorder:     { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  accountIcon:          { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  accountRowContent:    { flex: 1 },
  accountRowLabel:      { fontSize: 12, fontWeight: "600", color: "#9CA3AF", marginBottom: 2 },
  accountRowValue:      { fontSize: 14, fontWeight: "500", color: "#111827" },

  // Menu
  menuSection:    { backgroundColor: "rgba(255,255,255)", borderRadius: 20, padding: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  menuItem:       { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 4 },
  menuIcon:       { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
  menuTitle:      { flex: 1, fontSize: 16, fontWeight: "600", color: "#111827" },

  // Videos
  videosContainer:{ backgroundColor: "#F8FAFC", marginHorizontal: 4, marginBottom: 8, borderRadius: 12, padding: 12 },
  videoCard:      { backgroundColor: "#FFFFFF", borderRadius: 12, marginRight: 12, overflow: "hidden", elevation: 3, width: 200 },
  videoInfo:      { padding: 8 },
  videoTitle:     { fontSize: 12, fontWeight: "600", color: "#111827", marginBottom: 2 },
  videoDuration:  { fontSize: 10, color: "#6B7280", marginBottom: 8 },
  youtubeBtn:     { flexDirection: "row", alignItems: "center", backgroundColor: "#FF0000", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start", gap: 4 },
  youtubeBtnText: { color: "#FFFFFF", fontSize: 10, fontWeight: "500" },

  // Contact
  contactContainer:{ backgroundColor: "#F8FAFC", marginHorizontal: 4, marginBottom: 8, borderRadius: 12, padding: 16 },
  contactItem:    { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 12 },
  contactDetails: { flex: 1 },
  contactLabel:   { fontSize: 12, fontWeight: "600", color: "#6B7280", marginBottom: 2 },
  contactValue:   { fontSize: 14, fontWeight: "500", color: "#111827" },

  // Video modal
  modalOverlay:          { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  centeredVideoContainer:{ width: width * 0.9, backgroundColor: "rgba(0,0,0,0.9)", borderRadius: 16, overflow: "hidden" },
  videoModalHeader:      { flexDirection: "row", justifyContent: "flex-end", padding: 16 },
  centeredVideoPlayer:   { width: "100%", height: 250 },
  videoModalInfo:        { padding: 16, alignItems: "center" },
  centeredVideoTitle:    { color: "#FFF", fontSize: 16, fontWeight: "600", textAlign: "center", marginBottom: 8 },
  centeredVideoDuration: { color: "#9CA3AF", fontSize: 14, textAlign: "center" },

    signOutBtn:            { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: 20, padding: 16, marginTop: 16, marginBottom: 8 },
  signOutText:           { fontSize: 16, fontWeight: "600", color: "#EF4444" },
  deleteBtn:             { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, marginBottom: 8 },
  deleteText:            { fontSize: 14, color: "#9CA3AF" },

  // Reminders slot
  remindersSection:      { backgroundColor: "rgba(255,255,255)", borderRadius: 20, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  remindersSectionHeader:{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  remindersIconWrap:     { width: 32, height: 32, borderRadius: 8, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  remindersSectionTitle: { flex: 1, fontSize: 15, fontWeight: "700", color: "#111827" },
  remindersViewAll:      { fontSize: 13, fontWeight: "600", color: "#2563EB" },
  remindersEmpty:        { alignItems: "center", paddingVertical: 16, gap: 6 },
  remindersEmptyText:    { fontSize: 13, color: "#9CA3AF" },
  reminderRow:           { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  reminderTimeChip:      { backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  reminderTimeText:      { fontSize: 14, fontWeight: "700", color: "#2563EB" },
  reminderMedName:       { flex: 1, fontSize: 14, color: "#374151", fontWeight: "500" },
  remindersMore:         { fontSize: 13, color: "#2563EB", fontWeight: "600", textAlign: "center", paddingTop: 10 },
});
