import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { BrandAppIcon, TabChatIcon, TabLikesIcon, TabPersonalityIcon, TabProfileIcon } from "../../src/components/icons";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E63946",
        tabBarInactiveTintColor: "#6B6B6B",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingTop: 4,
          borderRadius: 18,
        },
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 82,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopWidth: 0,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: "rgba(255,255,255,0.78)",
          shadowColor: "#6B3940",
          shadowOpacity: 0.14,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
        },
        sceneStyle: {
          backgroundColor: "#FFFFFF",
        },
        tabBarBackground: () => (
          <View style={styles.tabBackground}>
            <View style={styles.glowLeft} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="personality"
        options={{
          title: "Personality",
          tabBarIcon: ({ color }) => <TabPersonalityIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Likes",
          tabBarIcon: ({ color }) => <TabLikesIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "",
          tabBarLabel: "",
          tabBarIcon: () => <BrandAppIcon size={26} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <TabChatIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabProfileIcon color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
    overflow: "hidden",
  },
  glowLeft: {
    position: "absolute",
    top: -10,
    left: 24,
    width: 110,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.48)",
  },
});
