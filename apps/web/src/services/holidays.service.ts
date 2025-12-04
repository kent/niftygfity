import { apiClient } from "@/lib/api-client";
import type {
  Holiday,
  CreateHolidayRequest,
  ShareLinkResponse,
  HolidayCollaborator,
} from "@niftygifty/types";

class HolidaysService {
  async getAll(): Promise<Holiday[]> {
    return apiClient.get<Holiday[]>("/holidays");
  }

  async getTemplates(): Promise<Holiday[]> {
    return apiClient.get<Holiday[]>("/holidays/templates");
  }

  async getById(id: number): Promise<Holiday> {
    return apiClient.get<Holiday>(`/holidays/${id}`);
  }

  async create(data: CreateHolidayRequest["holiday"]): Promise<Holiday> {
    return apiClient.post<Holiday>("/holidays", { holiday: data });
  }

  async update(
    id: number,
    data: Partial<CreateHolidayRequest["holiday"]>
  ): Promise<Holiday> {
    return apiClient.patch<Holiday>(`/holidays/${id}`, { holiday: data });
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/holidays/${id}`);
  }

  // Sharing methods
  async getShareLink(id: number): Promise<ShareLinkResponse> {
    return apiClient.get<ShareLinkResponse>(`/holidays/${id}/share`);
  }

  async regenerateShareLink(id: number): Promise<ShareLinkResponse> {
    return apiClient.post<ShareLinkResponse>(`/holidays/${id}/share`);
  }

  async join(shareToken: string): Promise<Holiday> {
    return apiClient.post<Holiday>("/holidays/join", { share_token: shareToken });
  }

  async leave(id: number): Promise<void> {
    return apiClient.delete(`/holidays/${id}/leave`);
  }

  async getCollaborators(id: number): Promise<HolidayCollaborator[]> {
    return apiClient.get<HolidayCollaborator[]>(`/holidays/${id}/collaborators`);
  }

  async removeCollaborator(holidayId: number, userId: number): Promise<void> {
    return apiClient.delete(`/holidays/${holidayId}/collaborators/${userId}`);
  }
}

export const holidaysService = new HolidaysService();

