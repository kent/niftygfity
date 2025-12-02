import { apiClient } from "@/lib/api-client";
import type { GiftSuggestion, Gift } from "@niftygifty/types";

class GiftSuggestionsService {
  async getAll(personId: number): Promise<GiftSuggestion[]> {
    return apiClient.get<GiftSuggestion[]>(`/people/${personId}/gift_suggestions`);
  }

  async generate(personId: number): Promise<GiftSuggestion[]> {
    return apiClient.post<GiftSuggestion[]>(`/people/${personId}/gift_suggestions`, {});
  }

  async refineForHoliday(personId: number, suggestionIds: number[], holidayId: number): Promise<GiftSuggestion[]> {
    return apiClient.post<GiftSuggestion[]>(`/people/${personId}/gift_suggestions/refine`, {
      suggestion_ids: suggestionIds,
      holiday_id: holidayId,
    });
  }

  async accept(id: number, holidayId?: number): Promise<Gift> {
    const body = holidayId ? { holiday_id: holidayId } : {};
    return apiClient.post<Gift>(`/gift_suggestions/${id}/accept`, body);
  }

  async discard(id: number): Promise<void> {
    return apiClient.delete(`/gift_suggestions/${id}`);
  }
}

export const giftSuggestionsService = new GiftSuggestionsService();

