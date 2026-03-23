import { Stack, Redirect } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";

export default function OnboardingLayout() {
  const { isOnboardingComplete } = useAppFlow();

  if (isOnboardingComplete) {
    return <Redirect href="/(tabs)/discover" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom", animationDuration: 260, gestureEnabled: true }} />;
}
