import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Heart, Lock, Unlock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  commonCommunityProfiles,
  receivedLikes,
  sameDatingGoalProfiles,
  similarInterestProfiles,
  suggestedProfiles,
} from "../../src/features/prototype/data";
import { PAGE_GUTTER, PAGE_TOP_OFFSET } from "../../src/theme/layout";

type LikesView = "recommended" | "received";

export default function LikesScreen() {
  const [activeView, setActiveView] = useState<LikesView>("recommended");
  const recommendationSections = useMemo(
    () => [
      {
        key: "suggested",
        title: "Suggested for you",
        subtitle: "Profiles picked from your recent matching vibe",
        data: suggestedProfiles,
      },
      {
        key: "interest",
        title: "Similar interest",
        subtitle: "People who overlap with your interests",
        data: similarInterestProfiles,
      },
      {
        key: "goal",
        title: "Same dating goal",
        subtitle: "Profiles looking for the same kind of connection",
        data: sameDatingGoalProfiles,
      },
      {
        key: "communities",
        title: "Communities in common",
        subtitle: "People from circles you already belong to",
        data: commonCommunityProfiles,
      },
    ],
    [],
  );
  const unlockedLikes = receivedLikes.filter((item) => item.unlocked).length;
  const lockedLikes = receivedLikes.length - unlockedLikes;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Likes</Text>

        <View style={styles.toggleShell}>
          <Pressable onPress={() => setActiveView("recommended")} style={[styles.toggleItem, activeView === "recommended" ? styles.toggleItemActive : null]}>
            <View style={styles.toggleInner}>
              <Heart color={activeView === "recommended" ? "#E63946" : "#6B6B6B"} fill={activeView === "recommended" ? "#E63946" : "none"} size={14} strokeWidth={2.2} />
              <Text style={[styles.toggleText, activeView === "recommended" ? styles.toggleTextActive : null]}>Recommended</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setActiveView("received")} style={[styles.toggleItem, activeView === "received" ? styles.toggleItemActive : null]}>
            <View style={styles.toggleInner}>
              {activeView === "received" ? <Unlock color="#E63946" size={14} strokeWidth={2.3} /> : <Lock color="#6B6B6B" size={14} strokeWidth={2.3} />}
              <Text style={[styles.toggleText, activeView === "received" ? styles.toggleTextActive : null]}>Who Likes You</Text>
            </View>
          </Pressable>
        </View>

        {activeView === "recommended" ? (
          recommendationSections.map((section) => (
            <View key={section.key} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationRow}>
                {section.data.map((profile) => (
                  <Pressable key={profile.id} style={styles.recommendationCard}>
                    <Image source={{ uri: profile.image }} style={styles.recommendationImage} />
                    <View style={styles.imageOverlay} />
                    <View style={styles.recommendationBadge}>
                      <Text style={styles.recommendationBadgeText}>{"badge" in profile ? profile.badge : `${profile.match} Match`}</Text>
                    </View>
                    <View style={styles.recommendationMeta}>
                      <Text style={styles.recommendationName}>
                        {profile.name}, {profile.age}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ))
        ) : (
          <>
            <View style={styles.likesSummaryCard}>
              <View style={styles.likesSummaryTop}>
                <View>
                  <Text style={styles.sectionTitle}>Who Likes You</Text>
                  <Text style={styles.sectionSubtitle}>See the people who have already shown interest in you.</Text>
                </View>
                <View style={styles.summaryHeart}>
                  <Heart color="#FFFFFF" fill="#FFFFFF" size={18} strokeWidth={2.2} />
                </View>
              </View>

              <View style={styles.accessRow}>
                <View style={[styles.accessPill, styles.accessPillActive]}>
                  <Unlock color="#E63946" size={15} strokeWidth={2.4} />
                  <Text style={styles.accessTextActive}>{unlockedLikes} unlocked</Text>
                </View>
                <View style={styles.accessPill}>
                  <Lock color="#6B6B6B" size={15} strokeWidth={2.4} />
                  <Text style={styles.accessText}>{lockedLikes} locked</Text>
                </View>
              </View>
            </View>

            <View style={styles.grid}>
              {receivedLikes.map((person) => (
                <View key={person.id} style={styles.likeCard}>
                  <Image source={{ uri: person.image }} style={styles.likeImage} />
                  <View style={styles.imageOverlay} />

                  <View style={styles.likeMeta}>
                    <Text style={styles.likeName}>
                      {person.name}, {person.age}
                    </Text>
                    <Text style={styles.likeReason}>{person.reason}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingTop: PAGE_TOP_OFFSET, paddingHorizontal: PAGE_GUTTER, paddingBottom: 120 },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  toggleShell: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
  },
  toggleItem: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleItemActive: {
    backgroundColor: "#FFFFFF",
  },
  toggleInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleText: {
    color: "#6B6B6B",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  toggleTextActive: {
    color: "#1C1C1C",
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#1C1C1C",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: "#6B6B6B",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  recommendationRow: {
    gap: 12,
    paddingRight: 6,
  },
  recommendationCard: {
    width: 146,
    borderRadius: 18,
    aspectRatio: 0.76,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  recommendationImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  recommendationBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  recommendationBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  recommendationMeta: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
  },
  recommendationName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  likesSummaryCard: {
    marginTop: 24,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#F8F2F3",
  },
  likesSummaryTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryHeart: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
  },
  accessRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  accessPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  accessPillActive: {
    backgroundColor: "rgba(230,57,70,0.10)",
  },
  accessText: {
    color: "#6B6B6B",
    fontSize: 13,
    fontWeight: "600",
  },
  accessTextActive: {
    color: "#E63946",
    fontSize: 13,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  likeCard: {
    width: "48%",
    borderRadius: 18,
    overflow: "hidden",
    aspectRatio: 0.76,
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  likeImage: {
    ...StyleSheet.absoluteFillObject,
  },
  likeMeta: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
  },
  likeName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  likeReason: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
});
