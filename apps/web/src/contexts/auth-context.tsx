"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { User, BillingStatus } from "@niftygifty/types";
import { authService, billingService } from "@/services";
import { ApiError } from "@/lib/api-client";
import { FREE_GIFT_LIMIT } from "@niftygifty/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  // Billing
  billingStatus: BillingStatus | null;
  isPremium: boolean;
  canCreateGift: boolean;
  giftsRemaining: number | null;
  refreshBillingStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);

  const refreshBillingStatus = useCallback(async () => {
    if (authService.isAuthenticated()) {
      try {
        const status = await billingService.getStatus();
        setBillingStatus(status);
      } catch {
        // Silently fail - billing status is nice to have
      }
    }
  }, []);

  useEffect(() => {
    // Check initial auth state
    setIsLoading(false);

    // Fetch billing status on mount if authenticated
    if (authService.isAuthenticated()) {
      refreshBillingStatus();
    }

    // Listen for auth changes
    const unsubscribe = authService.onAuthChange(() => {
      if (!authService.isAuthenticated()) {
        setUser(null);
        setBillingStatus(null);
      }
    });

    return unsubscribe;
  }, [refreshBillingStatus]);

  const signUp = useCallback(
    async (email: string, password: string, passwordConfirmation: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.signUp(
          email,
          password,
          passwordConfirmation
        );
        setUser(response.user);
        // Fetch billing status after signup
        await refreshBillingStatus();
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshBillingStatus]
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signIn(email, password);
      setUser(response.user);
      // Fetch billing status after signin
      await refreshBillingStatus();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshBillingStatus]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } catch {
      // Even if API call fails, clear local state
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Derived billing values
  const isPremium = billingStatus?.subscription_status === "active";
  const canCreateGift = billingStatus?.can_create_gift ?? true;
  const giftsRemaining = billingStatus?.gifts_remaining ?? FREE_GIFT_LIMIT;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user || authService.isAuthenticated(),
        signUp,
        signIn,
        signOut,
        error,
        clearError,
        // Billing
        billingStatus,
        isPremium,
        canCreateGift,
        giftsRemaining,
        refreshBillingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
