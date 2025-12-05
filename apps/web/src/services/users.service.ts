import type { User } from "@niftygifty/types";
import { apiClient } from "@/lib/api-client";

class UsersService {
  /** Force sync user profile from Clerk to backend */
  async syncProfile(): Promise<User> {
    return apiClient.post<User>("/profile/sync", {});
  }
}

export const usersService = new UsersService();

