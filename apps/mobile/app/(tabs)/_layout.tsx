import { Tabs } from "expo-router";

import { TabChatIcon, TabDiscoverIcon, TabLikesIcon, TabPersonalityIcon, TabProfileIcon } from "../../src/components/icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E63946",
        tabBarInactiveTintColor: "#6B6B6B",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#ECECEC",
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
        },
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
          title: "Discover",
          tabBarIcon: ({ color }) => <TabDiscoverIcon color={color} size={20} />,
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
