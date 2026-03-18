export type AccountStatus =
  | "unauthenticated"
  | "pending_verification"
  | "onboarding_in_progress"
  | "active"
  | "paused"
  | "deleted";

export type SupportedAuthProvider = "email" | "phone" | "google" | "apple";

export type OnboardingStepId =
  | "basic-profile"
  | "media"
  | "prompts"
  | "interests"
  | "lifestyle"
  | "personality"
  | "location"
  | "preferences";

export type BootstrapState = {
  accountStatus: AccountStatus;
  onboardingStep: OnboardingStepId | null;
  enabledTabs: string[];
  supportedAuthProviders: SupportedAuthProvider[];
  skippableOnboardingSteps: OnboardingStepId[];
};
