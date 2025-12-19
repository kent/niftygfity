import { apiClient } from "@/lib/api-client";
import { createHolidaysService } from "@niftygifty/services";

export const holidaysService = createHolidaysService(apiClient);
