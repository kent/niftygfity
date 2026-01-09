import type { ApiClient } from "@niftygifty/api-client";
import type {
  GiftExchange,
  GiftExchangeWithParticipants,
} from "@niftygifty/types";

export interface GiftExchangesService {
  getAll(): Promise<GiftExchange[]>;
  getById(id: number): Promise<GiftExchangeWithParticipants>;
}

export function createGiftExchangesService(client: ApiClient): GiftExchangesService {
  return {
    getAll() {
      return client.get<GiftExchange[]>("/gift_exchanges");
    },

    getById(id: number) {
      return client.get<GiftExchangeWithParticipants>(`/gift_exchanges/${id}`);
    },
  };
}
