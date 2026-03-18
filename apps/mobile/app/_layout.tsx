import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { AppFlowProvider } from "../src/features/app-flow/AppFlowProvider";
import { buildAppTheme } from "../src/theme/material3";

export default function RootLayout() {
  const theme = buildAppTheme(useColorScheme());

  return (
    <AppFlowProvider>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </AppFlowProvider>
  );
}
