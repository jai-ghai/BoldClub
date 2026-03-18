import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Camera, Check, ChevronRight, Crown, Edit3, MapPin, Settings, Shield, Users } from "lucide-react-native";
import { router } from "expo-router";

import type { ApiAccountStateResponse } from "../../src/types/api";

import { initialPrototypeProfile } from "../../src/features/prototype/data";
import { ApiError } from "../../src/lib/api";
import { getAccountState, pauseAccount, resumeAccount, deleteAccount } from "../../src/services/account";
import { logout } from "../../src/services/auth";

export default function ProfileScreen() {
  const [account, setAccount] = useState<ApiAccountStateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pauseReason, setPauseReason] = useState("Taking a break from dating.");
  const [deleteReason, setDeleteReason] = useState("Leaving the app for now.");
  const profile = initialPrototypeProfile;

  useEffect(() => {
    async function loadAccount() {
      setLoading(true);
      setError(null);

      try {
        const response = await getAccountState();
        setAccount(response);
      } catch (loadError) {
        if (loadError instanceof ApiError && (loadError.status === 401 || loadError.status === 403)) {
          router.replace("/");
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    void loadAccount();
  }, []);

  const completionPercentage = useMemo(() => (account?.is_profile_complete ? 100 : 42), [account]);

  async function handlePauseResume() {
    if (!account) {
      return;
    }

    setWorking(true);
    setError(null);
    try {
      const response = account.account_status === "paused" ? await resumeAccount() : await pauseAccount(pauseReason.trim());
      setAccount(response);
      router.replace("/");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update account state.");
    } finally {
      setWorking(false);
    }
  }

  async function handleDelete() {
    setWorking(true);
    setError(null);
    try {
      await deleteAccount(deleteReason.trim());
      router.replace("/");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to delete account.");
    } finally {
      setWorking(false);
    }
  }

  async function handleLogout() {
    setWorking(true);
    setError(null);
    try {
      await logout();
      router.replace("/");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to logout.");
    } finally {
      setWorking(false);
    }
  }

  const profileSections = [
    { id: "photos", label: "Photos", filled: 1, total: 6 },
    { id: "bio", label: "Bio & Basics", filled: 1, total: 1 },
    { id: "interests", label: "Interests", filled: 1, total: 1 },
    { id: "lifestyle", label: "Lifestyle", filled: 1, total: 1 },
    { id: "prompts", label: "Prompts", filled: 1, total: 3 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Profile</Text>
        <View style={styles.settingsCircle}>
          <Settings color="#6B6B6B" size={18} strokeWidth={2.2} />
        </View>
      </View>

      <View style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <View>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <Text style={styles.completionSubtitle}>{completionPercentage}% complete</Text>
          </View>
          <View style={styles.completionCircle}>
            <Text style={styles.completionCircleText}>{completionPercentage}%</Text>
          </View>
        </View>
        <View style={styles.completionTrack}>
          <View style={[styles.completionFill, { width: `${completionPercentage}%` }]} />
        </View>
        <Text style={styles.completionHint}>Complete your profile to get more matches.</Text>
      </View>

      <View style={styles.photoCard}>
        <Image
          source={{ uri: profile.heroPhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop" }}
          style={styles.profilePhoto}
        />
        <View style={styles.cameraButton}>
          <Camera color="#FFFFFF" size={18} strokeWidth={2.3} />
        </View>
      </View>

      <View style={styles.nameRow}>
        <View>
          <Text style={styles.nameText}>{profile.firstName || "Your Name"}, {profile.age || "26"}</Text>
          <View style={styles.locationRow}>
            <MapPin color="#6B6B6B" size={14} strokeWidth={2.2} />
            <Text style={styles.locationText}>{profile.city || "Your City"}</Text>
          </View>
        </View>
        <View style={styles.editButton}>
          <Edit3 color="#1C1C1C" size={14} strokeWidth={2.2} />
          <Text style={styles.editText}>Edit</Text>
        </View>
      </View>

      <View style={styles.sectionStack}>
        {profileSections.map((section) => (
          <View key={section.id} style={styles.sectionRow}>
            <View style={styles.sectionBadge}>
              {section.filled === section.total ? (
                <Check color="#E63946" size={14} strokeWidth={2.4} />
              ) : (
                <Text style={styles.sectionBadgeText}>
                  {section.filled}/{section.total}
                </Text>
              )}
            </View>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <ChevronRight color="#6B6B6B" size={18} strokeWidth={2.2} />
          </View>
        ))}
      </View>

      <Text style={styles.quickLinksTitle}>Quick Links</Text>
      <View style={styles.quickLinksGrid}>
        {[
          { id: "settings", label: "Settings", icon: <Settings color="#6B6B6B" size={22} strokeWidth={2.2} /> },
          { id: "privacy", label: "Privacy", icon: <Shield color="#6B6B6B" size={22} strokeWidth={2.2} /> },
          { id: "premium", label: "Premium", icon: <Crown color="#FFB4A2" size={22} strokeWidth={2.2} /> },
          { id: "invite", label: "Invite Friends", icon: <Users color="#6B6B6B" size={22} strokeWidth={2.2} /> },
        ].map((item) => (
          <View key={item.id} style={styles.quickLinkCard}>
            {item.icon}
            <Text style={styles.quickLinkText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {!loading && account ? (
        <View style={styles.accountCard}>
          <Text style={styles.accountCardTitle}>Account Controls</Text>
          <Text style={styles.accountState}>Status: {account.account_status.replaceAll("_", " ")}</Text>

          <TextInput
            onChangeText={setPauseReason}
            placeholder="Pause reason"
            placeholderTextColor="#6B6B6B"
            style={styles.controlInput}
            value={pauseReason}
          />
          <Pressable onPress={() => void handlePauseResume()} style={styles.primaryControlButton}>
            <Text style={styles.primaryControlText}>
              {working ? "Working..." : account.account_status === "paused" ? "Resume Dating" : "Pause Dating"}
            </Text>
          </Pressable>

          <TextInput
            onChangeText={setDeleteReason}
            placeholder="Delete reason"
            placeholderTextColor="#6B6B6B"
            style={styles.controlInput}
            value={deleteReason}
          />
          <Pressable onPress={() => void handleDelete()} style={styles.secondaryControlButton}>
            <Text style={styles.secondaryControlText}>Delete Account</Text>
          </Pressable>
          <Pressable onPress={() => void handleLogout()} style={styles.secondaryControlButton}>
            <Text style={styles.secondaryControlText}>Log Out</Text>
          </Pressable>
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingTop: 58, paddingHorizontal: 16, paddingBottom: 110 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  settingsCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
  completionCard: { marginTop: 16, borderRadius: 20, padding: 16, backgroundColor: "#E63946" },
  completionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  completionTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  completionSubtitle: { color: "rgba(255,255,255,0.82)", fontSize: 13, marginTop: 4 },
  completionCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: "rgba(255,255,255,0.20)", alignItems: "center", justifyContent: "center" },
  completionCircleText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  completionTrack: { height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.30)", overflow: "hidden" },
  completionFill: { height: "100%", backgroundColor: "#FFFFFF", borderRadius: 999 },
  completionHint: { marginTop: 10, color: "rgba(255,255,255,0.82)", fontSize: 12 },
  photoCard: { marginTop: 18, position: "relative" },
  profilePhoto: { width: "100%", aspectRatio: 0.8, borderRadius: 22 },
  cameraButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: { marginTop: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameText: { color: "#1C1C1C", fontSize: 28, fontWeight: "800" },
  locationRow: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: { color: "#6B6B6B", fontSize: 13 },
  editButton: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, backgroundColor: "#F5F5F5", paddingHorizontal: 14, paddingVertical: 10 },
  editText: { color: "#1C1C1C", fontSize: 13, fontWeight: "600" },
  sectionStack: { marginTop: 18, gap: 10 },
  sectionRow: { borderRadius: 14, backgroundColor: "#F5F5F5", padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  sectionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeText: { color: "#6B6B6B", fontSize: 10, fontWeight: "700" },
  sectionLabel: { flex: 1, color: "#1C1C1C", fontSize: 15, fontWeight: "600" },
  quickLinksTitle: { marginTop: 22, marginBottom: 12, color: "#1C1C1C", fontSize: 18, fontWeight: "700" },
  quickLinksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  quickLinkCard: { width: "48%", borderRadius: 16, backgroundColor: "#F5F5F5", paddingVertical: 18, alignItems: "center", gap: 8 },
  quickLinkText: { color: "#1C1C1C", fontSize: 13, fontWeight: "500" },
  accountCard: { marginTop: 24, borderRadius: 18, backgroundColor: "#F5F5F5", padding: 16, gap: 12 },
  accountCardTitle: { color: "#1C1C1C", fontSize: 18, fontWeight: "700" },
  accountState: { color: "#6B6B6B", fontSize: 13 },
  controlInput: { minHeight: 48, borderRadius: 12, backgroundColor: "#FFFFFF", paddingHorizontal: 14, color: "#1C1C1C" },
  primaryControlButton: { minHeight: 48, borderRadius: 12, backgroundColor: "#E63946", alignItems: "center", justifyContent: "center" },
  primaryControlText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  secondaryControlButton: { minHeight: 48, borderRadius: 12, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  secondaryControlText: { color: "#1C1C1C", fontSize: 14, fontWeight: "700" },
  errorText: { marginTop: 16, color: "#C1121F", fontSize: 13, lineHeight: 20 },
});
