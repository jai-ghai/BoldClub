import type { AccountStatus, OnboardingStepId, SupportedAuthProvider } from "./app";

export type ApiBootstrapResponse = {
  user_id: string | null;
  account_status: AccountStatus;
  onboarding_step: OnboardingStepId | null;
  is_profile_complete: boolean;
  enabled_tabs: string[];
  supported_auth_providers: SupportedAuthProvider[];
  skippable_onboarding_steps: OnboardingStepId[];
};

export type ApiAuthSessionResponse = {
  user_id: string;
  account_status: AccountStatus;
  requires_otp: boolean;
  next_route: string;
  access_token: string | null;
  refresh_token: string | null;
  token_type: string | null;
  verification_target: string | null;
  onboarding_step: OnboardingStepId | null;
  is_profile_complete: boolean;
};

export type ApiOnboardingStateResponse = {
  account_status: AccountStatus;
  current_step: OnboardingStepId | null;
  completed_steps: OnboardingStepId[];
  skipped_steps: OnboardingStepId[];
  required_steps_remaining: OnboardingStepId[];
  is_profile_complete: boolean;
};

export type ApiOnboardingStepDefinition = {
  id: OnboardingStepId;
  title: string;
  required: boolean;
  can_skip: boolean;
};

export type ApiOnboardingPlanResponse = ApiOnboardingStateResponse & {
  steps: ApiOnboardingStepDefinition[];
};

export type ApiCompleteOnboardingResponse = {
  account_status: AccountStatus;
  next_route: string;
  is_profile_complete: boolean;
};

export type ApiAccountStateResponse = {
  user_id: string;
  account_status: AccountStatus;
  next_route: string;
  is_profile_complete: boolean;
};

export type ApiDeleteAccountResponse = {
  success: boolean;
  next_route: string;
};
