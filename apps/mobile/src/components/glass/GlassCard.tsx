import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.shell, style]}>
      <LinearGradient
        colors={["rgba(255,255,255,0.30)", "rgba(255,255,255,0.10)"] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderRadius: 28,
    padding: 20,
    backgroundColor: "rgba(27, 17, 34, 0.46)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
