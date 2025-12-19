import { apiClient } from "@/lib/api-client";
import type {
  ExchangeInviteDetails,
  AcceptInviteResponse,
} from "@niftygifty/types";

class ExchangeInvitesService {
  // Public endpoint - no auth required
  async getInviteDetails(token: string): Promise<ExchangeInviteDetails> {
    return apiClient.get<ExchangeInviteDetails>(`/exchange_invite/${token}`);
  }

  // Requires auth
  async acceptInvite(token: string): Promise<AcceptInviteResponse> {
    return apiClient.post<AcceptInviteResponse>(`/exchange_invite/${token}/accept`);
  }

  // Requires auth
  async declineInvite(token: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/exchange_invite/${token}/decline`);
  }
}

export const exchangeInvitesService = new ExchangeInvitesService();
