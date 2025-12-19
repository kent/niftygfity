import type { ApiClient } from "@niftygifty/api-client";
import type { GiftStatus, CreateGiftStatusRequest } from "@niftygifty/types";

export interface GiftStatusesService {
  getAll(): Promise<GiftStatus[]>;
  getById(id: number): Promise<GiftStatus>;
  create(data: CreateGiftStatusRequest["gift_status"]): Promise<GiftStatus>;
  update(id: number, data: Partial<CreateGiftStatusRequest["gift_status"]>): Promise<GiftStatus>;
  delete(id: number): Promise<void>;
}

export function createGiftStatusesService(client: ApiClient): GiftStatusesService {
  return {
    getAll() {
      return client.get<GiftStatus[]>("/gift_statuses");
    },

    getById(id: number) {
      return client.get<GiftStatus>(`/gift_statuses/${id}`);
    },

    create(data: CreateGiftStatusRequest["gift_status"]) {
      return client.post<GiftStatus>("/gift_statuses", { gift_status: data });
    },

    update(id: number, data: Partial<CreateGiftStatusRequest["gift_status"]>) {
      return client.patch<GiftStatus>(`/gift_statuses/${id}`, { gift_status: data });
    },

    delete(id: number) {
      return client.delete(`/gift_statuses/${id}`);
    },
  };
}
