import type { AccountStatus } from "../types/app";

export type AppRoute = "/(auth)" | "/(onboarding)" | "/(tabs)/discover" | "/(tabs)/profile";

export function routeForAccountStatus(accountStatus: AccountStatus): AppRoute {
  if (accountStatus === "unauthenticated" || accountStatus === "pending_verification" || accountStatus === "deleted") {
    return "/(auth)";
  }

  if (accountStatus === "onboarding_in_progress") {
    return "/(onboarding)";
  }

  if (accountStatus === "paused") {
    return "/(tabs)/profile";
  }

  return "/(tabs)/discover";
}
