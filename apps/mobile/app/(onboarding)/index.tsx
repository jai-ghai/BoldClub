import { Redirect } from "expo-router";

import { useAppFlow } from "../../src/features/app-flow/AppFlowProvider";
import { getCurrentOnboardingRoute } from "../../src/features/onboarding/routes";

export default function OnboardingIndexScreen() {
  const { profile, skippedOnboardingRoutes } = useAppFlow();

  return <Redirect href={`/(onboarding)/${getCurrentOnboardingRoute(profile, skippedOnboardingRoutes)}`} />;
}
