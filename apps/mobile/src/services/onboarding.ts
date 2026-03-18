import type { ApiCompleteOnboardingResponse, ApiOnboardingPlanResponse, ApiOnboardingStateResponse } from "../types/api";

import { apiFetch } from "../lib/api";

export async function getOnboardingPlan() {
  return apiFetch<ApiOnboardingPlanResponse>("/v1/onboarding/plan", {
    requiresAuth: true,
  });
}

export async function saveOnboardingStep(stepId: string, payload: Record<string, unknown>) {
  return apiFetch<ApiOnboardingStateResponse>(`/v1/onboarding/${stepId}`, {
    method: "PUT",
    requiresAuth: true,
    body: { payload },
  });
}

export async function skipOnboardingStep(stepId: string) {
  return apiFetch<ApiOnboardingStateResponse>(`/v1/onboarding/${stepId}/skip`, {
    method: "POST",
    requiresAuth: true,
    body: { reason: "Skipped from mobile shell" },
  });
}

export async function completeOnboarding() {
  return apiFetch<ApiCompleteOnboardingResponse>("/v1/onboarding/complete", {
    method: "POST",
    requiresAuth: true,
  });
}
