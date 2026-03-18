import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Check, ChevronDown, ChevronUp, Clock3, Coffee, Crown, Flower2, Gift, Heart, Sparkles, Star } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { blogPosts, digitalGifts, membershipPlans, personalityTraits } from "../../src/features/prototype/data";

export default function PersonalityScreen() {
  const [showMembershipPlans, setShowMembershipPlans] = useState(false);

  function renderGiftIcon(icon: string) {
    switch (icon) {
      case "Rose":
        return <Flower2 color="#E63946" size={24} strokeWidth={2.1} />;
      case "Coffee":
        return <Coffee color="#C1121F" size={24} strokeWidth={2.1} />;
      case "Star":
        return <Star color="#E63946" fill="#FFE1DD" size={24} strokeWidth={2.1} />;
      default:
        return <Heart color="#E63946" fill="#FFE1DD" size={24} strokeWidth={2.1} />;
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Personality</Text>
        <Text style={styles.subheader}>Your compatibility insights</Text>

        <Pressable onPress={() => setShowMembershipPlans((current) => !current)} style={styles.membershipBanner}>
          <View style={styles.membershipIconWrap}>
            <Crown color="#FFFFFF" size={24} strokeWidth={2.2} />
          </View>
          <View style={styles.membershipCopy}>
            <Text style={styles.membershipTitle}>Upgrade to Premium</Text>
            <Text style={styles.membershipSubtitle}>See who likes you & more</Text>
          </View>
          {showMembershipPlans ? <ChevronUp color="#FFFFFF" size={18} strokeWidth={2.2} /> : <ChevronDown color="#FFFFFF" size={18} strokeWidth={2.2} />}
        </Pressable>

        {showMembershipPlans ? (
          <View style={styles.membershipList}>
            {membershipPlans.map((plan) => (
              <View key={plan.name} style={[styles.planCard, plan.popular ? styles.planCardPopular : null]}>
                <View style={styles.planHeader}>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.popular ? <Text style={styles.popularBadge}>POPULAR</Text> : null}
                  </View>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
                {plan.features.map((feature) => (
                  <View key={feature} style={styles.planFeature}>
                    <Check color="#E63946" size={14} strokeWidth={2.4} />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
                <Pressable style={[styles.planButton, plan.popular ? styles.planButtonPopular : null]}>
                  <Text style={[styles.planButtonText, plan.popular ? styles.planButtonTextPopular : null]}>Choose {plan.name}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Send Digital Gifts</Text>
            <Gift color="#E63946" size={18} strokeWidth={2.2} />
          </View>
          <Text style={styles.sectionSubtitle}>Send thoughtful gifts without sharing addresses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.giftRow}>
            {digitalGifts.map((gift) => (
              <Pressable key={gift.id} style={styles.giftCard}>
                <View style={styles.giftIconWrap}>{renderGiftIcon(gift.icon)}</View>
                <Text style={styles.giftName}>{gift.name}</Text>
                <Text style={styles.giftPrice}>{gift.price}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.personalityCard}>
          <View style={styles.personalityHeader}>
            <View style={styles.personalityIconWrap}>
              <Sparkles color="#FFFFFF" size={22} strokeWidth={2.2} />
            </View>
            <View style={styles.personalityHeaderCopy}>
              <Text style={styles.personalityTitle}>The Intentional Romantic</Text>
              <Text style={styles.personalitySubtitle}>Your personality type</Text>
            </View>
          </View>
          <Text style={styles.personalityBody}>
            You approach relationships with purpose and clarity. You seek meaningful connections built on mutual respect and shared values.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Traits</Text>
          {personalityTraits.map((trait) => (
            <View key={trait.name} style={styles.traitBlock}>
              <View style={styles.traitHeader}>
                <Text style={styles.traitName}>{trait.name}</Text>
                <Text style={styles.traitValue}>{trait.value}%</Text>
              </View>
              <View style={styles.traitTrack}>
                <View style={[styles.traitFill, { width: `${trait.value}%`, backgroundColor: trait.color }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Insights & Tips</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          {blogPosts.map((post) => (
            <Pressable key={post.id} style={styles.blogCard}>
              <Image source={{ uri: post.image }} style={styles.blogImage} />
              <View style={styles.blogMeta}>
                <Text style={styles.blogCategory}>{post.category}</Text>
                <Text style={styles.blogTitle}>{post.title}</Text>
                <View style={styles.blogTimeRow}>
                  <Clock3 color="#6B6B6B" size={12} strokeWidth={2.2} />
                  <Text style={styles.blogTime}>{post.readTime} read</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 16, paddingBottom: 120 },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  subheader: { marginTop: 4, color: "#6B6B6B", fontSize: 14 },
  membershipBanner: {
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#E63946",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  membershipIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  membershipCopy: { flex: 1 },
  membershipTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  membershipSubtitle: { color: "rgba(255,255,255,0.82)", fontSize: 13, marginTop: 4 },
  membershipList: { marginTop: 14, gap: 12 },
  planCard: { borderRadius: 16, borderWidth: 1, borderColor: "#ECECEC", padding: 16, backgroundColor: "#FFFFFF" },
  planCardPopular: { borderColor: "#E63946", backgroundColor: "rgba(230,57,70,0.05)" },
  planHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  planTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  planName: { color: "#1C1C1C", fontSize: 16, fontWeight: "700" },
  popularBadge: { borderRadius: 999, backgroundColor: "#E63946", color: "#FFFFFF", fontSize: 10, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 3 },
  planPrice: { color: "#1C1C1C", fontSize: 16, fontWeight: "700" },
  planFeature: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  planFeatureText: { color: "#6B6B6B", fontSize: 13 },
  planButton: { marginTop: 14, minHeight: 42, borderRadius: 12, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
  planButtonPopular: { backgroundColor: "#E63946" },
  planButtonText: { color: "#1C1C1C", fontSize: 14, fontWeight: "700" },
  planButtonTextPopular: { color: "#FFFFFF" },
  section: { marginTop: 24 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: "#1C1C1C", fontSize: 18, fontWeight: "700" },
  sectionSubtitle: { color: "#6B6B6B", fontSize: 13, marginBottom: 12 },
  giftRow: { gap: 10, paddingRight: 6 },
  giftCard: { width: 88, borderRadius: 14, backgroundColor: "#F5F5F5", paddingVertical: 14, alignItems: "center" },
  giftIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  giftName: { marginTop: 6, color: "#1C1C1C", fontSize: 12, fontWeight: "600" },
  giftPrice: { marginTop: 2, color: "#6B6B6B", fontSize: 11 },
  personalityCard: { marginTop: 24, borderRadius: 20, padding: 18, backgroundColor: "rgba(255,180,162,0.20)" },
  personalityHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  personalityHeaderCopy: { flex: 1 },
  personalityIconWrap: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#E63946", alignItems: "center", justifyContent: "center" },
  personalityTitle: { color: "#1C1C1C", fontSize: 18, fontWeight: "700" },
  personalitySubtitle: { color: "#6B6B6B", fontSize: 13, marginTop: 4 },
  personalityBody: { color: "#1C1C1C", fontSize: 14, lineHeight: 22, marginTop: 4 },
  traitBlock: { marginTop: 14 },
  traitHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  traitName: { color: "#1C1C1C", fontSize: 14 },
  traitValue: { color: "#6B6B6B", fontSize: 13 },
  traitTrack: { height: 8, borderRadius: 999, backgroundColor: "#ECECEC", overflow: "hidden" },
  traitFill: { height: "100%", borderRadius: 999 },
  seeAll: { color: "#E63946", fontSize: 13, fontWeight: "600" },
  blogCard: { flexDirection: "row", gap: 12, padding: 12, borderRadius: 14, backgroundColor: "#F5F5F5", marginTop: 12 },
  blogImage: { width: 80, height: 80, borderRadius: 10 },
  blogMeta: { flex: 1 },
  blogCategory: { color: "#E63946", fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  blogTitle: { color: "#1C1C1C", fontSize: 14, fontWeight: "600", lineHeight: 20, marginTop: 4 },
  blogTimeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 },
  blogTime: { color: "#6B6B6B", fontSize: 11 },
});
