import { Platform } from "react-native";

import { clearAccessToken, getAccessToken } from "./session";

const DEFAULT_API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:8000",
  default: "http://127.0.0.1:8000",
});

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

export function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL || "http://127.0.0.1:8000";
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  requiresAuth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.requiresAuth) {
    const token = await getAccessToken();

    if (!token) {
      throw new ApiError(401, "You are not signed in.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, `Unable to reach the API at ${getApiBaseUrl()}. Check your backend and EXPO_PUBLIC_API_BASE_URL.`);
  }

  if (response.status === 401 && options.requiresAuth) {
    await clearAccessToken();
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const detail =
      typeof data?.detail === "string"
        ? data.detail
        : typeof data?.message === "string"
          ? data.message
          : "Request failed.";
    throw new ApiError(response.status, detail);
  }

  return data as T;
}
