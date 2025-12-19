import { apiClient } from "@/lib/api-client";
import { createGiftsService } from "@niftygifty/services";

export const giftsService = createGiftsService(apiClient);
