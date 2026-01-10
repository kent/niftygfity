import type { ApiErrorData } from "./types.js";

// =============================================================================
// Configuration
// =============================================================================

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

// =============================================================================
// ApiError
// =============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiErrorData
  ) {
    super(data.error || data.errors?.join(", ") || "An error occurred");
    this.name = "ApiError";
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidationError() {
    return this.status === 422;
  }
}

// =============================================================================
// Types
// =============================================================================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// =============================================================================
// Utilities
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// ApiClient
// =============================================================================

export class ApiClient {
  private apiKey: string;
  private workspaceId: number | null = null;
  private baseUrl: string;

  constructor(config: { baseUrl: string; apiKey: string }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  setWorkspaceId(workspaceId: number | null) {
    this.workspaceId = workspaceId;
  }

  getWorkspaceId(): number | null {
    return this.workspaceId;
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = DEFAULT_TIMEOUT_MS,
      retries = method === "GET" ? MAX_RETRIES : 0,
    } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    if (this.workspaceId) {
      headers["X-Workspace-ID"] = String(this.workspaceId);
    }

    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const config: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (options.body && method !== "GET") {
        config.body = JSON.stringify(options.body);
      }

      try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData: ApiErrorData = await response.json().catch(() => ({
            error: "An error occurred",
          }));
          throw new ApiError(response.status, errorData);
        }

        if (response.status === 204) {
          return {} as T;
        }

        return response.json();
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof ApiError) {
          if (err.status >= 400 && err.status < 500) {
            throw err;
          }
        }

        if (err instanceof Error && err.name === "AbortError") {
          lastError = new ApiError(0, { error: `Request timeout after ${timeout}ms` });
        } else {
          lastError = err instanceof Error ? err : new Error(String(err));
        }

        if (attempt < retries) {
          await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, "body">): Promise<T> {
    return this.request<T>("GET", endpoint, options);
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "body">): Promise<T> {
    return this.request<T>("POST", endpoint, { ...options, body });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "body">): Promise<T> {
    return this.request<T>("PUT", endpoint, { ...options, body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "body">): Promise<T> {
    return this.request<T>("PATCH", endpoint, { ...options, body });
  }

  delete<T = void>(endpoint: string, options?: Omit<RequestOptions, "body">): Promise<T> {
    return this.request<T>("DELETE", endpoint, options);
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    if (this.workspaceId) {
      headers["X-Workspace-ID"] = String(this.workspaceId);
    }

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "An error occurred",
      }));
      throw new ApiError(response.status, errorData);
    }

    return response.json();
  }
}

// =============================================================================
// Client Factory
// =============================================================================

export interface NiftyGiftyClientConfig {
  apiUrl: string;
  apiKey: string;
}

export function createClient(config: NiftyGiftyClientConfig): ApiClient {
  return new ApiClient({ baseUrl: config.apiUrl, apiKey: config.apiKey });
}
