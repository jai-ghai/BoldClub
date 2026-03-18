import { useEffect, useState } from "react";
import { Tabs } from "expo-router";

import { TabChatIcon, TabDiscoverIcon, TabLikesIcon, TabPersonalityIcon, TabProfileIcon } from "../../src/components/icons";
import { getBootstrapState } from "../../src/lib/bootstrap";

const ALL_TABS = ["personality", "likes", "discover", "chat", "profile"];

export default function TabLayout() {
  const [enabledTabs, setEnabledTabs] = useState<string[]>(ALL_TABS);

  useEffect(() => {
    void getBootstrapState().then((bootstrap) => {
      setEnabledTabs(bootstrap.enabledTabs.length > 0 ? bootstrap.enabledTabs : ["profile"]);
    });
  }, []);

  const isVisible = (tabName: string) => enabledTabs.includes(tabName);

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
          href: isVisible("personality") ? undefined : null,
          tabBarIcon: ({ color }) => <TabPersonalityIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Likes",
          href: isVisible("likes") ? undefined : null,
          tabBarIcon: ({ color }) => <TabLikesIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          href: isVisible("discover") ? undefined : null,
          tabBarIcon: ({ color }) => <TabDiscoverIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          href: isVisible("chat") ? undefined : null,
          tabBarIcon: ({ color }) => <TabChatIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: isVisible("profile") ? undefined : null,
          tabBarIcon: ({ color }) => <TabProfileIcon color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
