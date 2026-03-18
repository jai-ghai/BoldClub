import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Camera, Check, ChevronDown, ChevronRight, Crown, MapPin, Settings, Shield, SquarePen, Users } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { samplePhotos } from "../../src/features/prototype/data";

export default function ProfileScreen() {
  const { profile } = useAppFlow();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const profileSections = useMemo(
    () => [
      { id: "photos", label: "Photos", filled: profile.heroPhoto ? 1 : 0, total: 6 },
      { id: "bio", label: "Bio & Basics", filled: profile.introLine ? 1 : 0, total: 1 },
      { id: "interests", label: "Interests", filled: profile.interests ? 1 : 0, total: 1 },
      { id: "lifestyle", label: "Lifestyle", filled: profile.lifestyle ? 1 : 0, total: 1 },
      { id: "prompts", label: "Prompts", filled: profile.promptAnswer ? 1 : 0, total: 3 },
    ],
    [profile.heroPhoto, profile.interests, profile.introLine, profile.lifestyle, profile.promptAnswer],
  );

  const completedSections = profileSections.reduce((sum, section) => sum + section.filled, 0);
  const totalSections = profileSections.reduce((sum, section) => sum + section.total, 0);
  const completionPercentage = Math.round((completedSections / totalSections) * 100);
  const heroPhoto = profile.heroPhoto || samplePhotos[0];

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Profile</Text>
          <Pressable style={styles.headerButton}>
            <Settings color="#6B6B6B" size={18} strokeWidth={2.2} />
          </Pressable>
        </View>

        <View style={styles.completionCard}>
          <View style={styles.completionTopRow}>
            <View>
              <Text style={styles.completionTitle}>Profile Completion</Text>
              <Text style={styles.completionSubtitle}>{completionPercentage}% complete</Text>
            </View>
            <View style={styles.completionBadge}>
              <Text style={styles.completionBadgeText}>{completionPercentage}%</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>
          <Text style={styles.completionNote}>Complete your profile to get more matches.</Text>
        </View>

        <View style={styles.photoWrap}>
          <Image source={{ uri: heroPhoto }} style={styles.heroPhoto} />
          <Pressable style={styles.cameraButton}>
            <Camera color="#FFFFFF" size={18} strokeWidth={2.2} />
          </Pressable>
        </View>

        <View style={styles.nameRow}>
          <View>
            <Text style={styles.nameText}>
              {profile.firstName || "Your Name"}, {profile.age || "Age"}
            </Text>
            <View style={styles.locationRow}>
              <MapPin color="#6B6B6B" size={14} strokeWidth={2.2} />
              <Text style={styles.locationText}>{profile.city || "Your City"}</Text>
            </View>
          </View>
          <Pressable style={styles.editButton}>
            <SquarePen color="#1C1C1C" size={16} strokeWidth={2.2} />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.sectionsList}>
          {profileSections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const isComplete = section.filled === section.total;

            return (
              <Pressable key={section.id} onPress={() => setExpandedSection(isExpanded ? null : section.id)} style={styles.sectionCard}>
                <View style={styles.sectionCardLeft}>
                  <View style={[styles.sectionStatus, isComplete ? styles.sectionStatusComplete : null]}>
                    {isComplete ? (
                      <Check color="#E63946" size={15} strokeWidth={2.4} />
                    ) : (
                      <Text style={styles.sectionStatusText}>
                        {section.filled}/{section.total}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.sectionLabel}>{section.label}</Text>
                </View>
                {isExpanded ? <ChevronDown color="#6B6B6B" size={18} strokeWidth={2.2} /> : <ChevronRight color="#6B6B6B" size={18} strokeWidth={2.2} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.quickLinks}>
          <Text style={styles.quickLinksTitle}>Quick Links</Text>
          <View style={styles.quickLinksGrid}>
            <View style={styles.quickLinkCard}>
              <Settings color="#6B6B6B" size={24} strokeWidth={2.1} />
              <Text style={styles.quickLinkText}>Settings</Text>
            </View>
            <View style={styles.quickLinkCard}>
              <Shield color="#6B6B6B" size={24} strokeWidth={2.1} />
              <Text style={styles.quickLinkText}>Privacy</Text>
            </View>
            <View style={styles.quickLinkCard}>
              <Crown color="#FFB4A2" size={24} strokeWidth={2.1} />
              <Text style={styles.quickLinkText}>Premium</Text>
            </View>
            <View style={styles.quickLinkCard}>
              <Users color="#6B6B6B" size={24} strokeWidth={2.1} />
              <Text style={styles.quickLinkText}>Invite Friends</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 16, paddingBottom: 120 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  completionCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#E63946",
  },
  completionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  completionTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  completionSubtitle: { marginTop: 4, color: "rgba(255,255,255,0.82)", fontSize: 13 },
  completionBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  completionBadgeText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.28)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  completionNote: { marginTop: 10, color: "rgba(255,255,255,0.82)", fontSize: 12 },
  photoWrap: {
    marginTop: 18,
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
  },
  heroPhoto: {
    width: "100%",
    aspectRatio: 0.8,
  },
  cameraButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameText: { color: "#1C1C1C", fontSize: 28, fontWeight: "800" },
  locationRow: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: { color: "#6B6B6B", fontSize: 14 },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F5F5F5",
  },
  editButtonText: { color: "#1C1C1C", fontSize: 14, fontWeight: "600" },
  sectionsList: { marginTop: 22, gap: 10 },
  sectionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  sectionCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  sectionStatus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionStatusComplete: {
    backgroundColor: "rgba(230,57,70,0.14)",
  },
  sectionStatusText: { color: "#6B6B6B", fontSize: 11, fontWeight: "700" },
  sectionLabel: { color: "#1C1C1C", fontSize: 15, fontWeight: "600" },
  quickLinks: { marginTop: 24 },
  quickLinksTitle: { color: "#1C1C1C", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  quickLinksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  quickLinkCard: {
    width: "48%",
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickLinkText: { color: "#1C1C1C", fontSize: 14, fontWeight: "600" },
});
