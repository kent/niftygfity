import { apiClient } from "@/lib/api-client";
import type { Gift, CreateGiftRequest } from "@niftygifty/types";

class GiftsService {
  async getAll(): Promise<Gift[]> {
    return apiClient.get<Gift[]>("/gifts");
  }

  async getById(id: number): Promise<Gift> {
    return apiClient.get<Gift>(`/gifts/${id}`);
  }

  async create(data: CreateGiftRequest["gift"]): Promise<Gift> {
    return apiClient.post<Gift>("/gifts", { gift: data });
  }

  async update(
    id: number,
    data: Partial<CreateGiftRequest["gift"]>
  ): Promise<Gift> {
    return apiClient.patch<Gift>(`/gifts/${id}`, { gift: data });
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/gifts/${id}`);
  }

  async reorder(id: number, newPosition: number): Promise<Gift[]> {
    return apiClient.patch<Gift[]>(`/gifts/${id}/reorder`, { position: newPosition });
  }
}

export const giftsService = new GiftsService();

