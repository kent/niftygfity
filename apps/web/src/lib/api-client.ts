import type { ApiError as ApiErrorType } from "@niftygifty/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiErrorType
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

  get isGiftLimitReached() {
    return this.status === 402 && (this.data as Record<string, unknown>).upgrade_required === true;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private token: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("jwt_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("jwt_token", token);
      } else {
        localStorage.removeItem("jwt_token");
      }
    }
    this.notifyListeners();
  }

  onAuthChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = this.token;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (options.body && method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Extract JWT token from response headers
    const authHeader = response.headers.get("Authorization");
    if (authHeader) {
      this.setToken(authHeader);
    }

    if (!response.ok) {
      const errorData: ApiErrorType = await response.json().catch(() => ({
        error: "An error occurred",
      }));
      throw new ApiError(response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, { body });
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, { body });
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", endpoint, { body });
  }

  delete<T = void>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }
}

// Singleton instance
export const apiClient = new ApiClient();

