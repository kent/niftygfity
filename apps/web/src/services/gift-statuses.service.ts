import { apiClient } from "@/lib/api-client";
import { createGiftStatusesService } from "@niftygifty/services";

export const giftStatusesService = createGiftStatusesService(apiClient);
