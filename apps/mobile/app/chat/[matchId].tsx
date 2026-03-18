import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Send } from "lucide-react-native";

export default function ChatThreadScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Chat</Text>
        <View style={styles.messageLeft}>
          <Text style={styles.messageLeftText}>I like how intentional your profile feels.</Text>
        </View>
        <View style={styles.messageRight}>
          <Text style={styles.messageRightText}>That means a lot. I wanted it to feel honest.</Text>
        </View>
        <View style={styles.messageLeft}>
          <Text style={styles.messageLeftText}>Coffee and a museum this weekend?</Text>
        </View>
      </ScrollView>
      <View style={styles.composer}>
        <TextInput placeholder="Type a message..." placeholderTextColor="#6B6B6B" style={styles.input} />
        <View style={styles.sendButton}>
          <Send color="#FFFFFF" size={18} strokeWidth={2.3} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingTop: 58, paddingHorizontal: 16, paddingBottom: 110, gap: 12 },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800", marginBottom: 8 },
  messageLeft: { alignSelf: "flex-start", maxWidth: "76%", borderRadius: 18, backgroundColor: "#F5F5F5", paddingHorizontal: 16, paddingVertical: 12 },
  messageRight: { alignSelf: "flex-end", maxWidth: "76%", borderRadius: 18, backgroundColor: "#E63946", paddingHorizontal: 16, paddingVertical: 12 },
  messageLeftText: { color: "#1C1C1C", fontSize: 14, lineHeight: 20 },
  messageRightText: { color: "#FFFFFF", fontSize: 14, lineHeight: 20 },
  composer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    backgroundColor: "#FFFFFF",
  },
  input: { flex: 1, minHeight: 44, borderRadius: 999, backgroundColor: "#F5F5F5", paddingHorizontal: 16, color: "#1C1C1C" },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E63946", alignItems: "center", justifyContent: "center" },
});
