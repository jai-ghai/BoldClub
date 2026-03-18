import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Check, Heart, MapPin, Quote, SlidersHorizontal, Star, BriefcaseBusiness, X, ChevronLeft } from "lucide-react-native";

import { discoverProfiles } from "../../src/features/prototype/data";

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const profile = useMemo(() => discoverProfiles[currentIndex % discoverProfiles.length], [currentIndex]);

  function moveNext() {
    setCurrentIndex((current) => (current + 1) % discoverProfiles.length);
    setShowFullProfile(false);
  }

  if (showFilters) {
    return (
      <View style={styles.container}>
        <View style={styles.filtersHeader}>
          <Pressable onPress={() => setShowFilters(false)}>
            <Text style={styles.filtersCancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.filtersTitle}>Filters</Text>
          <Pressable onPress={() => setShowFilters(false)}>
            <Text style={styles.filtersApply}>Apply</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.filtersContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Age Range</Text>
            <Text style={styles.filterValue}>26 - 34</Text>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Distance</Text>
            <Text style={styles.filterValue}>25 km</Text>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Looking For</Text>
            <View style={styles.pillWrap}>
              {["Long-term", "Short-term", "Friends", "Not sure"].map((item) => (
                <View key={item} style={styles.filterPill}>
                  <Text style={styles.filterPillText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Interests</Text>
            <View style={styles.pillWrap}>
              {["Travel", "Music", "Art", "Sports", "Food", "Books", "Movies", "Fitness"].map((item) => (
                <View key={item} style={styles.filterPill}>
                  <Text style={styles.filterPillText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (showFullProfile) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.fullProfileContent}>
          <View style={styles.fullHeader}>
            <Pressable onPress={() => setShowFullProfile(false)} style={styles.roundButton}>
              <ChevronLeft color="#1C1C1C" size={20} strokeWidth={2.4} />
            </Pressable>
            <Text style={styles.fullHeaderTitle}>{profile.name}'s Profile</Text>
          </View>

          <View style={styles.fullHeroWrap}>
            <Image source={{ uri: profile.image }} style={styles.fullHeroImage} />
            <View style={styles.fullHeroOverlay} />
            <View style={styles.fullHeroText}>
              <View style={styles.titleRow}>
                <Text style={styles.fullHeroName}>
                  {profile.name}, {profile.age}
                </Text>
                {profile.verified ? (
                  <View style={styles.verifiedBadge}>
                    <Check color="#FFFFFF" size={12} strokeWidth={2.6} />
                  </View>
                ) : null}
              </View>
              <View style={styles.metaRow}>
                <MapPin color="rgba(255,255,255,0.8)" size={14} strokeWidth={2.2} />
                <Text style={styles.fullHeroMeta}>{profile.distance}</Text>
              </View>
            </View>
          </View>

          <View style={styles.fullSectionCard}>
            <Text style={styles.fullSectionBody}>{profile.bio}</Text>
          </View>

          <View style={styles.inlineMetaRow}>
            <BriefcaseBusiness color="#6B6B6B" size={16} strokeWidth={2.1} />
            <Text style={styles.inlineMetaText}>{profile.job}</Text>
          </View>

          <View style={styles.fullSection}>
            <Text style={styles.fullSectionTitle}>Interests</Text>
            <View style={styles.pillWrap}>
              {profile.interests.map((item) => (
                <View key={item} style={styles.interestPill}>
                  <Text style={styles.interestPillText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.fullSectionCard}>
            <Text style={styles.cardMiniLabel}>Lifestyle</Text>
            <Text style={styles.fullSectionBody}>{profile.lifestyle}</Text>
          </View>
          <View style={styles.fullSectionCard}>
            <Text style={styles.cardMiniLabel}>Personality</Text>
            <Text style={styles.fullSectionBody}>{profile.personality}</Text>
          </View>
          <View style={styles.fullSectionCard}>
            <Text style={styles.cardMiniLabel}>What matters most in a partner?</Text>
            <View style={styles.quoteRow}>
              <Quote color="#E63946" size={16} strokeWidth={2.1} />
              <Text style={styles.quoteText}>{profile.promptAnswer}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionBar}>
          <Pressable onPress={moveNext} style={styles.smallAction}>
            <X color="#6B6B6B" size={26} strokeWidth={2.4} />
          </Pressable>
          <Pressable onPress={moveNext} style={styles.primaryAction}>
            <Heart color="#FFFFFF" fill="#FFFFFF" size={28} strokeWidth={2.4} />
          </Pressable>
          <Pressable style={styles.smallAction}>
            <Star color="#FFB4A2" fill="#FFB4A2" size={24} strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Pressable onPress={() => setShowFilters(true)} style={styles.filterButton}>
          <SlidersHorizontal color="#6B6B6B" size={18} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.cardWrap}>
        <Pressable onPress={() => setShowFullProfile(true)} style={styles.card}>
          <Image source={{ uri: profile.image }} style={styles.cardImage} />
          <View style={styles.cardOverlay} />
          <View style={styles.hintPill}>
            <Text style={styles.hintText}>Tap to view full profile</Text>
          </View>
          <View style={styles.cardText}>
            <View style={styles.titleRow}>
              <Text style={styles.cardName}>
                {profile.name}, {profile.age}
              </Text>
              {profile.verified ? (
                <View style={styles.verifiedBadge}>
                  <Check color="#FFFFFF" size={12} strokeWidth={2.6} />
                </View>
              ) : null}
            </View>
            <View style={styles.metaRow}>
              <MapPin color="rgba(255,255,255,0.82)" size={14} strokeWidth={2.2} />
              <Text style={styles.cardMeta}>{profile.distance}</Text>
            </View>
            <Text style={styles.cardBio}>{profile.bio}</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.actionBarInline}>
        <Pressable onPress={moveNext} style={styles.smallAction}>
          <X color="#6B6B6B" size={26} strokeWidth={2.4} />
        </Pressable>
        <Pressable onPress={moveNext} style={styles.primaryAction}>
          <Heart color="#FFFFFF" fill="#FFFFFF" size={28} strokeWidth={2.4} />
        </Pressable>
        <Pressable style={styles.smallAction}>
          <Star color="#FFB4A2" fill="#FFB4A2" size={24} strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#1C1C1C",
    fontSize: 24,
    fontWeight: "800",
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  hintPill: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.24)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hintText: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 11,
  },
  cardText: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 94,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  cardMeta: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
  },
  cardBio: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    marginTop: 10,
  },
  actionBarInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingBottom: 18,
  },
  smallAction: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primaryAction: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63946",
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  filtersHeader: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  filtersCancel: {
    color: "#6B6B6B",
    fontSize: 15,
  },
  filtersTitle: {
    color: "#1C1C1C",
    fontSize: 18,
    fontWeight: "700",
  },
  filtersApply: {
    color: "#E63946",
    fontSize: 15,
    fontWeight: "700",
  },
  filtersContent: {
    padding: 16,
    gap: 24,
  },
  filterSection: {
    gap: 12,
  },
  filterLabel: {
    color: "#1C1C1C",
    fontSize: 15,
    fontWeight: "700",
  },
  filterValue: {
    color: "#6B6B6B",
    fontSize: 14,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  filterPillText: {
    color: "#1C1C1C",
    fontSize: 13,
    fontWeight: "500",
  },
  fullProfileContent: {
    paddingBottom: 124,
  },
  fullHeader: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  fullHeaderTitle: {
    color: "#1C1C1C",
    fontSize: 18,
    fontWeight: "700",
  },
  fullHeroWrap: {
    marginHorizontal: 16,
    height: 440,
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
  },
  fullHeroImage: {
    width: "100%",
    height: "100%",
  },
  fullHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  fullHeroText: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
  fullHeroName: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  fullHeroMeta: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
  },
  fullSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  fullSectionTitle: {
    color: "#1C1C1C",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  interestPill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,180,162,0.30)",
  },
  interestPillText: {
    color: "#C1121F",
    fontSize: 13,
    fontWeight: "600",
  },
  fullSectionCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  cardMiniLabel: {
    color: "#6B6B6B",
    fontSize: 12,
    marginBottom: 6,
  },
  fullSectionBody: {
    color: "#1C1C1C",
    fontSize: 15,
    lineHeight: 22,
  },
  inlineMetaRow: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineMetaText: {
    color: "#1C1C1C",
    fontSize: 14,
  },
  quoteRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  quoteText: {
    flex: 1,
    color: "#1C1C1C",
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 16,
  },
});
