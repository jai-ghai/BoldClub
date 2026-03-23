import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Gift, Search, Send } from "lucide-react-native";

import { chatThreads, sampleMessages } from "../../src/features/prototype/data";
import { PAGE_GUTTER } from "../../src/theme/layout";

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const selectedChat = useMemo(() => chatThreads.find((item) => item.id === selectedChatId) ?? null, [selectedChatId]);
  const filteredChats = useMemo(
    () => chatThreads.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  if (selectedChat) {
    return (
      <View style={styles.container}>
        <View style={styles.threadHeader}>
          <Pressable onPress={() => setSelectedChatId(null)}>
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
          <Image source={{ uri: selectedChat.image }} style={styles.avatar} />
          <View style={styles.threadMeta}>
            <Text style={styles.threadName}>{selectedChat.name}</Text>
            <Text style={styles.threadStatus}>{selectedChat.online ? "Online" : "Offline"}</Text>
          </View>
          <Pressable style={styles.giftButton}>
            <Gift color="#E63946" size={18} strokeWidth={2.2} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.messageList}>
          {sampleMessages.map((item) => (
            <View key={item.id} style={[styles.messageRow, item.sent ? styles.messageRowRight : null]}>
              <View style={[styles.messageBubble, item.sent ? styles.messageBubbleSent : null]}>
                <Text style={[styles.messageText, item.sent ? styles.messageTextSent : null]}>{item.text}</Text>
                <Text style={[styles.messageTime, item.sent ? styles.messageTimeSent : null]}>{item.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composerRow}>
          <TextInput
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#6B6B6B"
            style={styles.composerInput}
            value={message}
          />
          <Pressable style={styles.sendButton}>
            <Send color="#FFFFFF" size={18} strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.header}>Messages</Text>
        <View style={styles.searchWrap}>
          <Search color="#6B6B6B" size={18} strokeWidth={2.2} />
          <TextInput
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            placeholderTextColor="#6B6B6B"
            style={styles.searchInput}
            value={searchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatList}>
        {filteredChats.map((chat) => (
          <Pressable key={chat.id} onPress={() => setSelectedChatId(chat.id)} style={styles.chatRow}>
            <View>
              <Image source={{ uri: chat.image }} style={styles.avatarLarge} />
              {chat.online ? <View style={styles.onlineDot} /> : null}
            </View>
            <View style={styles.chatMeta}>
              <View style={styles.chatMetaTop}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
              </View>
              <Text style={styles.chatPreview}>{chat.lastMessage}</Text>
            </View>
            {chat.unread > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{chat.unread}</Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  listHeader: { paddingTop: 58, paddingHorizontal: PAGE_GUTTER, paddingBottom: 8 },
  header: { color: "#1C1C1C", fontSize: 24, fontWeight: "800" },
  searchWrap: {
    marginTop: 14,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: "#1C1C1C", fontSize: 14 },
  chatList: { paddingBottom: 100 },
  chatRow: {
    paddingHorizontal: PAGE_GUTTER,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarLarge: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: {
    position: "absolute",
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#22C55E",
  },
  chatMeta: { flex: 1 },
  chatMetaTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chatName: { color: "#1C1C1C", fontSize: 15, fontWeight: "700" },
  chatTime: { color: "#6B6B6B", fontSize: 12 },
  chatPreview: { color: "#6B6B6B", fontSize: 14, marginTop: 4 },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  threadHeader: {
    paddingTop: 56,
    paddingHorizontal: PAGE_GUTTER,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  backLabel: { color: "#6B6B6B", fontSize: 15, fontWeight: "600" },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  threadMeta: { flex: 1 },
  threadName: { color: "#1C1C1C", fontSize: 15, fontWeight: "700" },
  threadStatus: { color: "#6B6B6B", fontSize: 12, marginTop: 2 },
  giftButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: { padding: PAGE_GUTTER, gap: 12, paddingBottom: 100 },
  messageRow: { flexDirection: "row" },
  messageRowRight: { justifyContent: "flex-end" },
  messageBubble: {
    maxWidth: "76%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
  },
  messageBubbleSent: { backgroundColor: "#E63946" },
  messageText: { color: "#1C1C1C", fontSize: 14, lineHeight: 20 },
  messageTextSent: { color: "#FFFFFF" },
  messageTime: { marginTop: 6, color: "#6B6B6B", fontSize: 10 },
  messageTimeSent: { color: "rgba(255,255,255,0.72)" },
  composerRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: PAGE_GUTTER,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    backgroundColor: "#FFFFFF",
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    color: "#1C1C1C",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
  },
});
