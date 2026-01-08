import { apiClient } from "@/lib/api-client";
import type { ImportPeopleResult } from "@niftygifty/types";

class ImportsService {
  async importPeople(file: File, ownerId?: number): Promise<ImportPeopleResult> {
    const formData = new FormData();
    formData.append("file", file);
    if (ownerId !== undefined) {
      formData.append("owner_id", String(ownerId));
    }
    return apiClient.postFormData<ImportPeopleResult>("/imports/people", formData);
  }
}

export const importsService = new ImportsService();
