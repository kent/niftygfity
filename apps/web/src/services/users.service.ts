import type { User } from "@niftygifty/types";
import { apiClient } from "@/lib/api-client";

interface SyncProfileParams {
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}

class UsersService {
  /** Force sync user profile from Clerk to backend */
  async syncProfile(params?: SyncProfileParams): Promise<User> {
    return apiClient.post<User>("/profile/sync", params || {});
  }
}

export const usersService = new UsersService();

