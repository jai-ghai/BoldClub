import type { ApiAccountStateResponse, ApiDeleteAccountResponse } from "../types/api";

import { apiFetch } from "../lib/api";
import { clearAccessToken } from "../lib/session";

export async function getAccountState() {
  return apiFetch<ApiAccountStateResponse>("/v1/account/me", {
    requiresAuth: true,
  });
}

export async function pauseAccount(reason: string) {
  return apiFetch<ApiAccountStateResponse>("/v1/account/pause", {
    method: "POST",
    requiresAuth: true,
    body: { reason },
  });
}

export async function resumeAccount() {
  return apiFetch<ApiAccountStateResponse>("/v1/account/resume", {
    method: "POST",
    requiresAuth: true,
  });
}

export async function deleteAccount(reason: string) {
  const response = await apiFetch<ApiDeleteAccountResponse>("/v1/account", {
    method: "DELETE",
    requiresAuth: true,
    body: { reason },
  });
  await clearAccessToken();
  return response;
}
