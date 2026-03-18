import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GlassButtonProps = {
  label: string;
  kind?: "primary" | "secondary";
  onPress?: () => void;
  disabled?: boolean;
};

export function GlassButton({ label, kind = "primary", onPress, disabled = false }: GlassButtonProps) {
  const colors: readonly [string, string] =
    kind === "primary"
      ? ["#FF4F7B", "#B741FF"]
      : ["rgba(255,255,255,0.18)", "rgba(255,255,255,0.08)"];

  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.pressable, disabled ? styles.disabled : null]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
        <Text style={styles.label}>{label}</Text>
        {kind === "primary" ? <View style={styles.glow} /> : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  disabled: {
    opacity: 0.55,
  },
  button: {
    overflow: "hidden",
    borderRadius: 18,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  glow: {
    position: "absolute",
    width: 90,
    height: 90,
    right: -16,
    top: -24,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
});
