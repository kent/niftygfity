import { apiClient } from "@/lib/api-client";
import type { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse } from "@niftygifty/types";

class ApiKeysService {
  async getAll(): Promise<ApiKey[]> {
    return apiClient.get<ApiKey[]>("/api_keys");
  }

  async create(data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    return apiClient.post<CreateApiKeyResponse>("/api_keys", { api_key: data });
  }

  async revoke(id: number): Promise<void> {
    return apiClient.delete(`/api_keys/${id}`);
  }
}

export const apiKeysService = new ApiKeysService();
