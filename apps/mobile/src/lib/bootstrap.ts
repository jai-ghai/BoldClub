import type { BootstrapState } from "../types/app";
import type { ApiBootstrapResponse } from "../types/api";

import { apiFetch, ApiError } from "./api";
import { clearAccessToken } from "./session";

function mapBootstrapResponse(response: ApiBootstrapResponse): BootstrapState {
  return {
    accountStatus: response.account_status,
    onboardingStep: response.onboarding_step,
    enabledTabs: response.enabled_tabs,
    supportedAuthProviders: response.supported_auth_providers,
    skippableOnboardingSteps: response.skippable_onboarding_steps,
  };
}

export async function getBootstrapState(): Promise<BootstrapState> {
  try {
    const response = await apiFetch<ApiBootstrapResponse>("/v1/bootstrap");
    return mapBootstrapResponse(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await clearAccessToken();
    }

    return {
      accountStatus: "unauthenticated",
      onboardingStep: null,
      enabledTabs: [],
      supportedAuthProviders: ["email", "phone", "google", "apple"],
      skippableOnboardingSteps: ["prompts", "interests", "lifestyle", "personality", "location"],
    };
  }
}
