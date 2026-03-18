import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "boldclub.access-token";

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? null;
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function setAccessToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function clearAccessToken(): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
