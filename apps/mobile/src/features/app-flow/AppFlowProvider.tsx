import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

import type { OnboardingRoute } from "../onboarding/routes";
import { initialPrototypeProfile, type PrototypeUserProfile } from "../prototype/data";

type AppFlowContextValue = {
  isOnboardingComplete: boolean;
  isDatingPaused: boolean;
  profile: PrototypeUserProfile;
  skippedOnboardingRoutes: OnboardingRoute[];
  updateProfile: <K extends keyof PrototypeUserProfile>(key: K, value: PrototypeUserProfile[K]) => void;
  replaceProfile: (nextProfile: PrototypeUserProfile) => void;
  skipOnboardingRoute: (route: OnboardingRoute) => void;
  completeOnboarding: () => void;
  setDatingPaused: (value: boolean) => void;
  resetApp: () => void;
};

const AppFlowContext = createContext<AppFlowContextValue | null>(null);

export function AppFlowProvider({ children }: PropsWithChildren) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isDatingPaused, setIsDatingPaused] = useState(false);
  const [profile, setProfile] = useState<PrototypeUserProfile>(initialPrototypeProfile);
  const [skippedOnboardingRoutes, setSkippedOnboardingRoutes] = useState<OnboardingRoute[]>([]);

  const value = useMemo<AppFlowContextValue>(
    () => ({
      isOnboardingComplete,
      isDatingPaused,
      profile,
      skippedOnboardingRoutes,
      updateProfile(key, value) {
        setProfile((current) => ({
          ...current,
          [key]: value,
        }));
      },
      replaceProfile(nextProfile) {
        setProfile(nextProfile);
      },
      skipOnboardingRoute(route) {
        setSkippedOnboardingRoutes((current) => (current.includes(route) ? current : [...current, route]));
      },
      completeOnboarding() {
        setIsOnboardingComplete(true);
      },
      setDatingPaused(value) {
        setIsDatingPaused(value);
      },
      resetApp() {
        setIsOnboardingComplete(false);
        setIsDatingPaused(false);
        setProfile(initialPrototypeProfile);
        setSkippedOnboardingRoutes([]);
      },
    }),
    [isDatingPaused, isOnboardingComplete, profile, skippedOnboardingRoutes],
  );

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
}

export function useAppFlow() {
  const context = useContext(AppFlowContext);

  if (!context) {
    throw new Error("useAppFlow must be used inside AppFlowProvider.");
  }

  return context;
}
