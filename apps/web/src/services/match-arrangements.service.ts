import { apiClient } from "@/lib/api-client";
import type {
  MatchArrangement,
  CreateMatchArrangementRequest,
  UpdateMatchArrangementRequest,
} from "@niftygifty/types";

class MatchArrangementsService {
  async getAll(): Promise<MatchArrangement[]> {
    return apiClient.get<MatchArrangement[]>("/match_arrangements");
  }

  async getById(id: number): Promise<MatchArrangement> {
    return apiClient.get<MatchArrangement>(`/match_arrangements/${id}`);
  }

  async getByHoliday(holidayId: number): Promise<MatchArrangement[]> {
    return apiClient.get<MatchArrangement[]>(`/holidays/${holidayId}/match_arrangements`);
  }

  async create(data: CreateMatchArrangementRequest["match_arrangement"]): Promise<MatchArrangement> {
    return apiClient.post<MatchArrangement>("/match_arrangements", { match_arrangement: data });
  }

  async update(
    id: number,
    data: UpdateMatchArrangementRequest["match_arrangement"]
  ): Promise<MatchArrangement> {
    return apiClient.patch<MatchArrangement>(`/match_arrangements/${id}`, { match_arrangement: data });
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/match_arrangements/${id}`);
  }
}

export const matchArrangementsService = new MatchArrangementsService();
