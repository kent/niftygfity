import type { ApiClient } from "@niftygifty/api-client";
import type {
  ExchangeInviteDetails,
  AcceptInviteResponse,
} from "@niftygifty/types";

export interface ExchangeInvitesService {
  /** Get invite details by token (public endpoint - no auth required) */
  getByToken(token: string): Promise<ExchangeInviteDetails>;
  /** Accept an invite (requires auth) */
  accept(token: string): Promise<AcceptInviteResponse>;
  /** Decline an invite (requires auth) */
  decline(token: string): Promise<{ message: string }>;
}

export function createExchangeInvitesService(client: ApiClient): ExchangeInvitesService {
  return {
    getByToken(token: string) {
      return client.get<ExchangeInviteDetails>(`/exchange_invite/${token}`);
    },

    accept(token: string) {
      return client.post<AcceptInviteResponse>(`/exchange_invite/${token}/accept`);
    },

    decline(token: string) {
      return client.post<{ message: string }>(`/exchange_invite/${token}/decline`);
    },
  };
}
