import { StyleSheet, Text, View } from "react-native";
import { Heart, MessageCircle } from "lucide-react-native";

export default function MatchRevealScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.matchCircle}>
        <Heart color="#E63946" fill="#E63946" size={28} strokeWidth={2.3} />
      </View>
      <Text style={styles.title}>It's a Match!</Text>
      <Text style={styles.subtitle}>You both liked each other. Start a conversation or check compatibility first.</Text>
      <View style={styles.primaryButton}>
        <MessageCircle color="#E63946" size={18} strokeWidth={2.3} />
        <Text style={styles.primaryButtonText}>Send a Message</Text>
      </View>
      <View style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Lowkey: Check Compatibility First</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E63946", alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  matchCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", marginBottom: 28 },
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  subtitle: { color: "rgba(255,255,255,0.84)", fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: 12, marginBottom: 28 },
  primaryButton: { minHeight: 54, borderRadius: 14, backgroundColor: "#FFFFFF", paddingHorizontal: 22, flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", width: "100%" },
  primaryButtonText: { color: "#E63946", fontSize: 15, fontWeight: "700" },
  secondaryButton: { minHeight: 54, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 22, alignItems: "center", justifyContent: "center", width: "100%", marginTop: 12 },
  secondaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
