import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Heart, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { receivedLikes, sentLikes, suggestedProfiles } from "../../src/features/prototype/data";

export default function LikesScreen() {
  const [activeView, setActiveView] = useState<"received" | "sent">("received");
  const currentLikes = activeView === "received" ? receivedLikes : sentLikes;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Likes</Text>

        <View style={styles.toggleShell}>
          <Pressable onPress={() => setActiveView("received")} style={[styles.toggleItem, activeView === "received" ? styles.toggleItemActive : null]}>
            <Text style={[styles.toggleText, activeView === "received" ? styles.toggleTextActive : null]}>Who Likes You ({receivedLikes.length})</Text>
          </Pressable>
          <Pressable onPress={() => setActiveView("sent")} style={[styles.toggleItem, activeView === "sent" ? styles.toggleItemActive : null]}>
            <Text style={[styles.toggleText, activeView === "sent" ? styles.toggleTextActive : null]}>Likes Sent ({sentLikes.length})</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {currentLikes.map((person) => (
            <View key={person.id} style={styles.likeCard}>
              <Image source={{ uri: person.image }} style={styles.likeImage} />
              <View style={styles.imageOverlay} />

              {activeView === "received" && "isNew" in person && person.isNew ? <Text style={styles.floatingBadge}>NEW</Text> : null}
              {activeView === "sent" && "pending" in person && person.pending ? <Text style={styles.pendingBadge}>PENDING</Text> : null}

              <View style={styles.likeMeta}>
                <Text style={styles.likeName}>
                  {person.name}, {person.age}
                </Text>
              </View>

              {activeView === "received" ? (
                <View style={styles.actionRow}>
                  <Pressable style={styles.iconButton}>
                    <X color="#6B6B6B" size={16} strokeWidth={2.4} />
                  </Pressable>
                  <Pressable style={styles.iconButtonPrimary}>
                    <Heart color="#FFFFFF" fill="#FFFFFF" size={16} strokeWidth={2.2} />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.likeMetaRight}>
                  {"pending" in person ? <Text style={styles.subtleStatus}>{person.pending ? "Waiting for reply" : "Seen"}</Text> : null}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested For You</Text>
          <Pressable>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedRow}>
          {suggestedProfiles.map((profile) => (
            <View key={profile.id} style={styles.suggestedCard}>
              <Image source={{ uri: profile.image }} style={styles.suggestedImage} />
              <View style={styles.imageOverlay} />
              <Text style={styles.matchBadge}>{profile.match} Match</Text>
              <View style={styles.suggestedNameWrap}>
                <Text style={styles.suggestedName}>
                  {profile.name}, {profile.age}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 16, paddingBottom: 120 },
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
  toggleText: {
    color: "#6B6B6B",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  toggleTextActive: {
    color: "#1C1C1C",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 14,
  },
  likeCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    aspectRatio: 0.76,
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  likeImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  floatingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E63946",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  pendingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#FFB4A2",
    color: "#1C1C1C",
    fontSize: 10,
    fontWeight: "700",
  },
  likeMeta: {
    position: "absolute",
    left: 12,
    bottom: 12,
    right: 12,
  },
  likeMetaRight: {
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
  subtleStatus: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  actionRow: {
    position: "absolute",
    right: 10,
    bottom: 10,
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPrimary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#1C1C1C",
    fontSize: 18,
    fontWeight: "700",
  },
  seeAll: {
    color: "#E63946",
    fontSize: 13,
    fontWeight: "600",
  },
  suggestedRow: {
    gap: 12,
    paddingRight: 8,
  },
  suggestedCard: {
    width: 128,
    borderRadius: 16,
    aspectRatio: 0.76,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  suggestedImage: {
    ...StyleSheet.absoluteFillObject,
  },
  matchBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 999,
    backgroundColor: "#E63946",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  suggestedNameWrap: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
  },
  suggestedName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
