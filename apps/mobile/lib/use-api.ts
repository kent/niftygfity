import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { apiClient, holidaysService, giftsService, giftStatusesService } from "./api";

/**
 * Hook that configures the API client with the current Clerk session token.
 * Call this once in your app to enable authenticated API requests.
 */
export function useApiSetup() {
  const { getToken } = useAuth();

  useEffect(() => {
    apiClient.setTokenGetter(getToken);
  }, [getToken]);
}

/**
 * Hook that returns configured service instances.
 * Ensures the API client is set up with auth before returning services.
 */
export function useServices() {
  useApiSetup();
  
  return {
    holidays: holidaysService,
    gifts: giftsService,
    giftStatuses: giftStatusesService,
  };
}
