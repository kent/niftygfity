import { apiClient } from "@/lib/api-client";
import type {
  User,
  AuthResponse,
  SignUpRequest,
  SignInRequest,
} from "@niftygifty/types";

class AuthService {
  async signUp(
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AuthResponse> {
    const payload: SignUpRequest = {
      user: {
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
    };
    return apiClient.post<AuthResponse>("/users", payload);
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const payload: SignInRequest = {
      user: { email, password },
    };
    return apiClient.post<AuthResponse>("/users/sign_in", payload);
  }

  async signOut(): Promise<void> {
    await apiClient.delete("/users/sign_out");
    apiClient.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  onAuthChange(listener: () => void): () => void {
    return apiClient.onAuthChange(listener);
  }
}

export const authService = new AuthService();

