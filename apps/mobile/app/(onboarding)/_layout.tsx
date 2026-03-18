import { Stack, Redirect } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";

export default function OnboardingLayout() {
  const { isAuthenticated, isOnboardingComplete } = useAppFlow();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  if (isOnboardingComplete) {
    return <Redirect href="/(tabs)/discover" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />;
}
