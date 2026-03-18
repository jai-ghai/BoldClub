import { StyleSheet, Text, View } from "react-native";

export default function CompatibilityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Compatibility</Text>
      <View style={styles.heroCard}>
        <Text style={styles.score}>82%</Text>
        <Text style={styles.title}>Strong values alignment</Text>
        <Text style={styles.copy}>
          GPT-4o-mini can explain why this match works across personality, relationship intent, conversation style, and lifestyle overlap.
        </Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.detailLabel}>Top reasons</Text>
        <Text style={styles.detailBody}>Intentional dating goals, thoughtful communication, and similar city rhythm.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: 58, paddingHorizontal: 16, gap: 16 },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  heroCard: { borderRadius: 20, backgroundColor: "#E63946", padding: 20 },
  score: { color: "#FFFFFF", fontSize: 44, fontWeight: "900" },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginTop: 6 },
  copy: { color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 22, marginTop: 10 },
  detailCard: { borderRadius: 18, backgroundColor: "#F5F5F5", padding: 16 },
  detailLabel: { color: "#6B6B6B", fontSize: 12, marginBottom: 6 },
  detailBody: { color: "#1C1C1C", fontSize: 15, lineHeight: 22 },
});
