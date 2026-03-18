import { Redirect } from "expo-router";

import { useAppFlow } from "../src/features/app-flow/AppFlowProvider";
import { getCurrentOnboardingRoute } from "../src/features/onboarding/routes";

export default function IndexScreen() {
  const { isAuthenticated, isOnboardingComplete, profile, skippedOnboardingRoutes } = useAppFlow();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  if (!isOnboardingComplete) {
    return <Redirect href={`/(onboarding)/${getCurrentOnboardingRoute(profile, skippedOnboardingRoutes)}`} />;
  }

  return <Redirect href="/(tabs)/discover" />;
}
