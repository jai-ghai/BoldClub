import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { buildAppTheme } from "../src/theme/material3";

export default function RootLayout() {
  const theme = buildAppTheme(useColorScheme());

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </>
  );
}
