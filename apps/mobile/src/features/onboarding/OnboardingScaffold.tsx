import type { PropsWithChildren } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";

type OnboardingScaffoldProps = PropsWithChildren<{
  step: number;
  totalSteps: number;
  canGoBack?: boolean;
  onBack?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  error?: string | null;
}>;

export function OnboardingScaffold({
  step,
  totalSteps,
  canGoBack = true,
  onBack,
  secondaryLabel,
  onSecondary,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  error,
  children,
}: OnboardingScaffoldProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            disabled={!canGoBack}
            onPress={onBack ?? (() => router.back())}
            style={[styles.backButton, !canGoBack ? styles.hiddenButton : null]}
          >
            <ChevronLeftIcon color="#1C1C1C" size={22} />
          </Pressable>
          <Text style={styles.counter}>
            {step + 1} of {totalSteps}
          </Text>
          {secondaryLabel && onSecondary ? (
            <Pressable accessibilityRole="button" onPress={onSecondary} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={styles.footer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={primaryDisabled}
          onPress={onPrimary}
          style={[styles.primaryButton, primaryDisabled ? styles.primaryButtonDisabled : null]}
        >
          <Text style={[styles.primaryButtonText, primaryDisabled ? styles.primaryButtonTextDisabled : null]}>{primaryLabel}</Text>
          <ChevronRightIcon color="#FFFFFF" size={18} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenButton: {
    opacity: 0,
  },
  counter: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  spacer: {
    width: 40,
  },
  secondaryButton: {
    minWidth: 48,
    minHeight: 32,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#E63946",
    fontSize: 14,
    fontWeight: "700",
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#ECECEC",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E63946",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 12,
  },
  errorText: {
    color: "#C1121F",
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#E63946",
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: "#ECECEC",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  primaryButtonTextDisabled: {
    color: "#8C8C8C",
  },
});
