import type { PrototypeUserProfile } from "../prototype/data";

export const onboardingRoutes = [
  "name",
  "age",
  "gender",
  "looking-for",
  "city",
  "photo",
  "intro",
  "prompt",
  "interests",
  "lifestyle",
  "personality",
  "preferences",
] as const;

export type OnboardingRoute = (typeof onboardingRoutes)[number];

export function getOnboardingRoute(index: number): OnboardingRoute {
  return onboardingRoutes[Math.max(0, Math.min(index, onboardingRoutes.length - 1))];
}

export function getOnboardingIndex(route: OnboardingRoute): number {
  return onboardingRoutes.indexOf(route);
}

export function getNextOnboardingRoute(route: OnboardingRoute): OnboardingRoute | null {
  const index = getOnboardingIndex(route);
  return index < onboardingRoutes.length - 1 ? onboardingRoutes[index + 1] : null;
}

export function getPreviousOnboardingRoute(route: OnboardingRoute): OnboardingRoute | null {
  const index = getOnboardingIndex(route);
  return index > 0 ? onboardingRoutes[index - 1] : null;
}

export function getCurrentOnboardingRoute(profile: PrototypeUserProfile, skippedRoutes: readonly OnboardingRoute[] = []): OnboardingRoute {
  const skipped = new Set(skippedRoutes);

  if (!profile.firstName.trim()) return "name";
  if (!profile.age.trim()) return "age";
  if (!profile.gender.trim()) return "gender";
  if (!profile.lookingFor.trim()) return "looking-for";
  if (!profile.city.trim()) return "city";
  if (!profile.heroPhoto.trim() && !skipped.has("photo")) return "photo";
  if (!profile.introLine.trim() && !skipped.has("intro")) return "intro";
  if (!profile.promptAnswer.trim() && !skipped.has("prompt")) return "prompt";
  if (!profile.interests.trim() && !skipped.has("interests")) return "interests";
  if (!profile.lifestyle.trim() && !skipped.has("lifestyle")) return "lifestyle";
  if (!profile.personality.trim() && !skipped.has("personality")) return "personality";
  if (!profile.intent.trim()) return "preferences";
  return "preferences";
}
