import { useMemo, useRef, useState } from "react";
import { Animated, Image, PanResponder, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BriefcaseBusiness, Check, ChevronDown, CircleSlash, Heart, MapPin, Quote, SlidersHorizontal, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandAppIcon } from "../../src/components/icons";
import { discoverProfiles } from "../../src/features/prototype/data";
import { PAGE_GUTTER, PAGE_TOP_OFFSET } from "../../src/theme/layout";

const STACK_DEPTH = 3;

export default function DiscoverScreen() {
  const { width } = useWindowDimensions();
  const swipeThreshold = width * 0.15;
  const swipeDistance = width * 1.1;
  const pan = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const profile = useMemo(() => discoverProfiles[currentIndex % discoverProfiles.length], [currentIndex]);
  const stackedProfiles = useMemo(
    () =>
      Array.from({ length: Math.min(STACK_DEPTH, discoverProfiles.length) }, (_, offset) => discoverProfiles[(currentIndex + offset) % discoverProfiles.length]),
    [currentIndex],
  );

  function moveNext() {
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex((current) => (current + 1) % discoverProfiles.length);
  }

  function resetCardPosition() {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }

  function animateSwipe(direction: "left" | "right") {
    Animated.timing(pan, {
      toValue: { x: direction === "right" ? swipeDistance : -swipeDistance, y: 0 },
      duration: 220,
      useNativeDriver: true,
    }).start(moveNext);
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, gestureState) => {
          const isFastRight = gestureState.vx > 0.6;
          const isFastLeft = gestureState.vx < -0.6;

          if (gestureState.dx > swipeThreshold || isFastRight) {
            animateSwipe("right");
            return;
          }

          if (gestureState.dx < -swipeThreshold || isFastLeft) {
            animateSwipe("left");
            return;
          }

          resetCardPosition();
        },
        onPanResponderTerminate: resetCardPosition,
      }),
    [pan, swipeThreshold, swipeDistance],
  );

  const rotation = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-14deg", "0deg", "14deg"],
    extrapolate: "clamp",
  });
  const nextCardScale = pan.x.interpolate({
    inputRange: [-swipeThreshold, 0, swipeThreshold],
    outputRange: [1, 0.96, 1],
    extrapolate: "clamp",
  });
  const nextCardTranslateY = pan.x.interpolate({
    inputRange: [-swipeThreshold, 0, swipeThreshold],
    outputRange: [4, 14, 4],
    extrapolate: "clamp",
  });
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const nopeOpacity = pan.x.interpolate({
    inputRange: [-swipeThreshold, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (showFilters) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <BrandAppIcon size={40} />
            <View>
              <Text style={styles.brandTitle}>Bold Club</Text>
              <Text style={styles.brandSubtitle}>Swipe, then scroll for the full profile</Text>
            </View>
          </View>
          <Pressable onPress={() => setShowFilters(true)} style={styles.filterButton}>
            <SlidersHorizontal color="#6B6B6B" size={18} strokeWidth={2.2} />
          </Pressable>
        </View>

        <View style={styles.deckWrap}>
          {stackedProfiles
            .slice(1)
            .reverse()
            .map((item, index) => {
              const depth = stackedProfiles.length - index - 1;

              return (
                <Animated.View
                  key={`${item.id}-${depth}`}
                  pointerEvents="none"
                  style={[
                    styles.card,
                    styles.stackedCard,
                    {
                      transform: [
                        { scale: depth === 1 ? nextCardScale : 0.92 },
                        { translateY: depth === 1 ? nextCardTranslateY : 24 },
                      ],
                      opacity: depth === 1 ? 0.92 : 0.62,
                    },
                  ]}
                >
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                  <View style={styles.cardOverlay} />
                </Animated.View>
              );
            })}

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                transform: [...pan.getTranslateTransform(), { rotate: rotation }],
              },
            ]}
          >
            <Image source={{ uri: profile.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay} />

            <Animated.View style={[styles.swipeBadge, styles.likeBadge, { opacity: likeOpacity }]}>
              <Text style={styles.swipeBadgeText}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.swipeBadge, styles.nopeBadge, { opacity: nopeOpacity }]}>
              <Text style={[styles.swipeBadgeText, styles.nopeBadgeText]}>PASS</Text>
            </Animated.View>

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

            <View style={styles.scrollCue}>
              <ChevronDown color="#FFFFFF" size={16} strokeWidth={2.6} />
              <CircleSlash color="rgba(255,255,255,0.76)" size={15} strokeWidth={2.2} />
            </View>
          </Animated.View>
        </View>

        <View style={styles.profileSummary}>
          <Text style={styles.sectionEyebrow}>Profile overview</Text>
          <Text style={styles.profileSummaryTitle}>
            {profile.name}, {profile.age}
          </Text>
          <View style={styles.inlineMetaRow}>
            <BriefcaseBusiness color="#6B6B6B" size={16} strokeWidth={2.1} />
            <Text style={styles.inlineMetaText}>{profile.job}</Text>
          </View>
          <View style={styles.inlineMetaRow}>
            <MapPin color="#6B6B6B" size={16} strokeWidth={2.1} />
            <Text style={styles.inlineMetaText}>{profile.location}</Text>
          </View>
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
          <Text style={styles.cardMiniLabel}>About</Text>
          <Text style={styles.fullSectionBody}>{profile.bio}</Text>
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

        <View style={styles.endActionBar}>
          <Pressable onPress={() => animateSwipe("left")} style={styles.smallAction}>
            <X color="#6B6B6B" size={26} strokeWidth={2.4} />
          </Pressable>
          <Pressable onPress={() => animateSwipe("right")} style={styles.primaryAction}>
            <Heart color="#FFFFFF" fill="#FFFFFF" size={28} strokeWidth={2.4} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: PAGE_TOP_OFFSET,
    paddingHorizontal: PAGE_GUTTER,
    paddingBottom: 140,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandTitle: {
    color: "#1C1C1C",
    fontSize: 20,
    fontWeight: "800",
  },
  brandSubtitle: {
    marginTop: 2,
    color: "#6B6B6B",
    fontSize: 13,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  deckWrap: {
    height: 650,
    marginTop: 22,
    justifyContent: "center",
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  stackedCard: {
    backgroundColor: "#F1F1F1",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  swipeBadge: {
    position: "absolute",
    top: 26,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  likeBadge: {
    right: 22,
    borderColor: "#22C55E",
  },
  nopeBadge: {
    left: 22,
    borderColor: "#FFB4A2",
  },
  swipeBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  nopeBadgeText: {
    color: "#FFD8CF",
  },
  cardText: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 62,
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
  scrollCue: {
    position: "absolute",
    left: "50%",
    bottom: 18,
    marginLeft: -30,
    width: 60,
    height: 32,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.24)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
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
  profileSummary: {
    marginTop: 28,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#F8F3F1",
  },
  sectionEyebrow: {
    color: "#E63946",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  profileSummaryTitle: {
    marginTop: 8,
    color: "#1C1C1C",
    fontSize: 28,
    fontWeight: "800",
  },
  inlineMetaRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineMetaText: {
    color: "#1C1C1C",
    fontSize: 14,
  },
  fullSection: {
    paddingTop: 22,
  },
  fullSectionTitle: {
    color: "#1C1C1C",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  endActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    marginTop: 28,
  },
  filtersHeader: {
    paddingTop: PAGE_TOP_OFFSET,
    paddingHorizontal: PAGE_GUTTER,
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
    paddingHorizontal: PAGE_GUTTER,
    paddingTop: 18,
    paddingBottom: 120,
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
});
