import { useState, type ReactNode } from "react";
import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { Bell, ChevronLeft, Eye, Lock, MoonStar, Shield, UserRoundX } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppFlow } from "../src/features/app-flow/AppFlowProvider";
import { PAGE_GUTTER, PAGE_TOP_OFFSET } from "../src/theme/layout";

export default function SettingsScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { isDatingPaused, resetApp, setDatingPaused } = useAppFlow();
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowReadReceipts, setAllowReadReceipts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privatePhotos, setPrivatePhotos] = useState(false);

  async function handleLogout() {
    try {
      await signOut();
    } finally {
      resetApp();
      router.replace("/(auth)");
    }
  }

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#1C1C1C" size={20} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.header}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{isDatingPaused ? "Dating paused" : "Dating is active"}</Text>
          <Text style={styles.heroText}>
            {isDatingPaused ? "You are hidden from discovery until you resume." : "You are visible in discovery and can keep matching."}
          </Text>
          <View style={styles.heroSwitchRow}>
            <Text style={styles.heroSwitchLabel}>{isDatingPaused ? "Resume dating" : "Pause dating"}</Text>
            <Switch
              onValueChange={(value) => setDatingPaused(value)}
              thumbColor="#FFFFFF"
              trackColor={{ false: "rgba(255,255,255,0.26)", true: "rgba(255,255,255,0.56)" }}
              value={isDatingPaused}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.optionCard}>
            <SettingsRow
              description="Choose whether matches can see when you are active."
              icon={<Eye color="#6B6B6B" size={18} strokeWidth={2.2} />}
              onValueChange={setShowOnlineStatus}
              title="Show online status"
              value={showOnlineStatus}
            />
            <SettingsRow
              description="Control whether message receipts are visible."
              icon={<Lock color="#6B6B6B" size={18} strokeWidth={2.2} />}
              onValueChange={setAllowReadReceipts}
              title="Read receipts"
              value={allowReadReceipts}
            />
            <SettingsRow
              description="Keep selected photos visible only after matching."
              icon={<Shield color="#6B6B6B" size={18} strokeWidth={2.2} />}
              onValueChange={setPrivatePhotos}
              title="Private photo mode"
              value={privatePhotos}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.optionCard}>
            <SettingsRow
              description="Get notified about matches, likes, and new messages."
              icon={<Bell color="#6B6B6B" size={18} strokeWidth={2.2} />}
              onValueChange={setPushNotifications}
              title="Push notifications"
              value={pushNotifications}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionCard}>
            <InfoRow icon={<MoonStar color="#6B6B6B" size={18} strokeWidth={2.2} />} label="Incognito mode" value="Premium feature" />
            <InfoRow icon={<UserRoundX color="#6B6B6B" size={18} strokeWidth={2.2} />} label="Block list" value="Manage people you've hidden" />
          </View>
        </View>

        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  value,
  onValueChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch onValueChange={onValueChange} trackColor={{ false: "#D9D9D9", true: "#F29AA2" }} thumbColor={value ? "#E63946" : "#FFFFFF"} value={value} />
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{label}</Text>
        <Text style={styles.rowDescription}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingTop: PAGE_TOP_OFFSET, paddingHorizontal: PAGE_GUTTER, paddingBottom: 120 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  headerSpacer: { width: 40 },
  heroCard: {
    marginTop: 18,
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#E63946",
  },
  heroTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  heroText: { marginTop: 8, color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 21 },
  heroSwitchRow: { marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroSwitchLabel: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  section: { marginTop: 26 },
  sectionTitle: { color: "#1C1C1C", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  optionCard: { borderRadius: 18, backgroundColor: "#F6F6F6", overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: { flex: 1 },
  rowTitle: { color: "#1C1C1C", fontSize: 15, fontWeight: "700" },
  rowDescription: { marginTop: 4, color: "#6B6B6B", fontSize: 12, lineHeight: 18 },
  logoutButton: {
    marginTop: 34,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
