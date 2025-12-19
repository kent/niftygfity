import { apiClient } from "@/lib/api-client";
import type {
  ExchangeExclusion,
  CreateExchangeExclusionRequest,
} from "@niftygifty/types";

class ExchangeExclusionsService {
  async getAll(exchangeId: number): Promise<ExchangeExclusion[]> {
    return apiClient.get<ExchangeExclusion[]>(
      `/gift_exchanges/${exchangeId}/exchange_exclusions`
    );
  }

  async create(
    exchangeId: number,
    data: CreateExchangeExclusionRequest["exchange_exclusion"]
  ): Promise<ExchangeExclusion> {
    return apiClient.post<ExchangeExclusion>(
      `/gift_exchanges/${exchangeId}/exchange_exclusions`,
      { exchange_exclusion: data }
    );
  }

  async delete(exchangeId: number, exclusionId: number): Promise<void> {
    return apiClient.delete(
      `/gift_exchanges/${exchangeId}/exchange_exclusions/${exclusionId}`
    );
  }
}

export const exchangeExclusionsService = new ExchangeExclusionsService();
