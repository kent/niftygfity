import * as SecureStore from "expo-secure-store";
import type { TokenCache } from "@clerk/clerk-expo";

const TOKEN_KEY = "clerk-token";

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Silently fail on web or other platforms without SecureStore
    }
  },

  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Silently fail
    }
  },
};
