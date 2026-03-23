import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";

import { useAppFlow } from "../src/features/app-flow/AppFlowProvider";
import { getCurrentOnboardingRoute } from "../src/features/onboarding/routes";

export default function IndexScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isOnboardingComplete, profile, skippedOnboardingRoutes } = useAppFlow();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  if (!isOnboardingComplete) {
    return <Redirect href={`/(onboarding)/${getCurrentOnboardingRoute(profile, skippedOnboardingRoutes)}`} />;
  }

  return <Redirect href="/(tabs)/discover" />;
}
