import { ApiClient, ApiError } from "@niftygifty/api-client";

// Re-export for backward compatibility
export { ApiError };

// Web-specific configuration
const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const isDebug = process.env.NODE_ENV === "development";

// Singleton instance configured for web
export const apiClient = new ApiClient({
  baseUrl: getApiUrl(),
  debug: isDebug,
});
