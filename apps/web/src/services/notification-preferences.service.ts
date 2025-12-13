import { apiClient } from "@/lib/api-client";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
  EmailDeliverySummary,
  EmailPreferencesResponse,
} from "@niftygifty/types";

// Server URL for token-based requests (no auth header)
const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class NotificationPreferencesService {
  // Authenticated endpoints (current user)
  async get(): Promise<NotificationPreferences> {
    return apiClient.get<NotificationPreferences>("/notification_preferences");
  }

  async update(data: UpdateNotificationPreferencesRequest): Promise<NotificationPreferences> {
    return apiClient.patch<NotificationPreferences>("/notification_preferences", data);
  }

  async getEmailHistory(): Promise<EmailDeliverySummary[]> {
    return apiClient.get<EmailDeliverySummary[]>("/notification_preferences/email_history");
  }

  // Token-based endpoints (no auth required, for email unsubscribe links)
  async getByToken(token: string): Promise<EmailPreferencesResponse> {
    const response = await fetch(`${getApiUrl()}/email_preferences/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Invalid or expired link");
    }
    return response.json();
  }

  async updateByToken(
    token: string,
    data: UpdateNotificationPreferencesRequest
  ): Promise<EmailPreferencesResponse> {
    const response = await fetch(`${getApiUrl()}/email_preferences/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update preferences");
    }
    return response.json();
  }
}

export const notificationPreferencesService = new NotificationPreferencesService();

