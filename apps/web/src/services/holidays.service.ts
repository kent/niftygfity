import { apiClient } from "@/lib/api-client";
import type { Holiday, CreateHolidayRequest } from "@niftygifty/types";

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
}

export const holidaysService = new HolidaysService();

