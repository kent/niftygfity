import { apiClient } from "@/lib/api-client";
import type { GiftStatus, CreateGiftStatusRequest } from "@niftygifty/types";

class GiftStatusesService {
  async getAll(): Promise<GiftStatus[]> {
    return apiClient.get<GiftStatus[]>("/gift_statuses");
  }

  async getById(id: number): Promise<GiftStatus> {
    return apiClient.get<GiftStatus>(`/gift_statuses/${id}`);
  }

  async create(data: CreateGiftStatusRequest["gift_status"]): Promise<GiftStatus> {
    return apiClient.post<GiftStatus>("/gift_statuses", { gift_status: data });
  }

  async update(
    id: number,
    data: Partial<CreateGiftStatusRequest["gift_status"]>
  ): Promise<GiftStatus> {
    return apiClient.patch<GiftStatus>(`/gift_statuses/${id}`, {
      gift_status: data,
    });
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/gift_statuses/${id}`);
  }
}

export const giftStatusesService = new GiftStatusesService();

