import type { ApiAuthSessionResponse } from "../types/api";

import { apiFetch, ApiError } from "../lib/api";
import { clearAccessToken, setAccessToken } from "../lib/session";

async function persistSessionIfPresent(response: ApiAuthSessionResponse) {
  if (response.access_token) {
    await setAccessToken(response.access_token);
  }

  return response;
}

export async function signupWithEmail(email: string, password: string) {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/signup", {
    method: "POST",
    body: {
      provider: "email",
      email,
      password,
    },
  });
  return persistSessionIfPresent(response);
}

export async function loginWithEmail(email: string, password: string) {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/login", {
    method: "POST",
    body: {
      provider: "email",
      email,
      password,
    },
  });
  return persistSessionIfPresent(response);
}

export async function signupWithEmailOtp(email: string) {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/signup", {
    method: "POST",
    body: {
      provider: "email",
      email,
    },
  });

  return persistSessionIfPresent(response);
}

export async function loginWithEmailOtp(email: string) {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/login", {
    method: "POST",
    body: {
      provider: "email",
      email,
    },
  });

  return persistSessionIfPresent(response);
}

export async function signupWithPhone(phoneNumber: string) {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/signup", {
    method: "POST",
    body: {
      provider: "phone",
      phone_number: phoneNumber,
    },
  });

  return persistSessionIfPresent(response);
}

export async function loginWithPhone(phoneNumber: string) {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/login", {
    method: "POST",
    body: {
      provider: "phone",
      phone_number: phoneNumber,
    },
  });

  return persistSessionIfPresent(response);
}

export async function verifyEmailOtp(destination: string, otpCode: string, purpose: "signup" | "login") {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/verify-otp", {
    method: "POST",
    body: {
      provider: "email",
      destination,
      otp_code: otpCode,
      purpose,
    },
  });

  return persistSessionIfPresent(response);
}

export async function resendEmailOtp(destination: string, purpose: "signup" | "login") {
  return apiFetch<ApiAuthSessionResponse>("/v1/auth/resend-otp", {
    method: "POST",
    body: {
      provider: "email",
      destination,
      purpose,
    },
  });
}

export async function verifyPhoneOtp(destination: string, otpCode: string, purpose: "signup" | "login") {
  const response = await apiFetch<ApiAuthSessionResponse>("/v1/auth/verify-otp", {
    method: "POST",
    body: {
      provider: "phone",
      destination,
      otp_code: otpCode,
      purpose,
    },
  });

  return persistSessionIfPresent(response);
}

export async function resendPhoneOtp(destination: string, purpose: "signup" | "login") {
  return apiFetch<ApiAuthSessionResponse>("/v1/auth/resend-otp", {
    method: "POST",
    body: {
      provider: "phone",
      destination,
      purpose,
    },
  });
}

export async function beginEmailAuth(email: string) {
  try {
    return await loginWithEmailOtp(email);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return signupWithEmailOtp(email);
    }

    throw error;
  }
}

export async function beginPhoneAuth(phoneNumber: string) {
  try {
    return await loginWithPhone(phoneNumber);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return signupWithPhone(phoneNumber);
    }

    throw error;
  }
}

export async function logout() {
  try {
    await apiFetch<{ success: boolean }>("/v1/auth/logout", {
      method: "POST",
      requiresAuth: true,
    });
  } finally {
    await clearAccessToken();
  }
}
