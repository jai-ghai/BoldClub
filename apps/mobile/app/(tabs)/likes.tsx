import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { receivedLikes, sentLikes, suggestedProfiles } from "../../src/features/prototype/data";

export default function LikesScreen() {
  const [activeView, setActiveView] = useState<"received" | "sent">("received");
  const currentLikes = activeView === "received" ? receivedLikes : sentLikes;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
            <View style={styles.likeInfo}>
              <Text style={styles.likeName}>
                {person.name}, {person.age}
              </Text>
              {"isNew" in person && person.isNew ? <Text style={styles.badge}>New</Text> : null}
              {"pending" in person ? <Text style={styles.subtleStatus}>{person.pending ? "Pending" : "Seen"}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Suggested for you</Text>
      <View style={styles.suggestedRow}>
        {suggestedProfiles.map((profile) => (
          <View key={profile.id} style={styles.suggestedCard}>
            <Image source={{ uri: profile.image }} style={styles.suggestedImage} />
            <Text style={styles.suggestedName}>
              {profile.name}, {profile.age}
            </Text>
            <Text style={styles.matchText}>{profile.match} match</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingTop: 58, paddingHorizontal: 16, paddingBottom: 100 },
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
    marginTop: 16,
  },
  likeCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  likeImage: {
    width: "100%",
    aspectRatio: 0.78,
  },
  likeInfo: {
    padding: 12,
    gap: 4,
  },
  likeName: {
    color: "#1C1C1C",
    fontSize: 15,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E63946",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  subtleStatus: {
    color: "#6B6B6B",
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    color: "#1C1C1C",
    fontSize: 18,
    fontWeight: "700",
  },
  suggestedRow: {
    flexDirection: "row",
    gap: 12,
  },
  suggestedCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  suggestedImage: {
    width: "100%",
    height: 160,
  },
  suggestedName: {
    paddingHorizontal: 12,
    paddingTop: 12,
    color: "#1C1C1C",
    fontSize: 14,
    fontWeight: "700",
  },
  matchText: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    color: "#E63946",
    fontSize: 12,
    fontWeight: "600",
  },
});
