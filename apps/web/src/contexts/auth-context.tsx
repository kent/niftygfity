"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
  ReactNode,
} from "react";
import type { User, BillingStatus } from "@niftygifty/types";
import { FREE_GIFT_LIMIT } from "@niftygifty/types";
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
} from "@clerk/nextjs";
import { billingService, mapClerkUser } from "@/services";
import { apiClient } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Auth actions
  signOut: () => Promise<void>;
  // Billing
  billingStatus: BillingStatus | null;
  isPremium: boolean;
  canCreateGift: boolean;
  giftsRemaining: number | null;
  refreshBillingStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded: isAuthLoaded } = useClerkAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useClerkUser();
  const clerk = useClerk();

  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);

  // Configure apiClient to use Clerk token
  useEffect(() => {
    apiClient.setTokenGetter(async () => {
      return await getToken();
    });
  }, [getToken]);

  const isAuthenticated = !!clerkUser;
  const isLoading = !isAuthLoaded || !isUserLoaded;

  // Memoize user to prevent unnecessary re-renders
  const user = useMemo(
    () => mapClerkUser(clerkUser, billingStatus),
    [clerkUser, billingStatus]
  );

  const refreshBillingStatus = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const status = await billingService.getStatus();
        setBillingStatus(status);
      } catch {
        // Silently fail - billing might not be set up yet
      }
    }
  }, [isAuthenticated]);

  // Sign out via Clerk
  const signOut = useCallback(async () => {
    setBillingStatus(null);
    await clerk.signOut();
  }, [clerk]);

  // Fetch billing status when authenticated
  // This is a valid data fetching pattern - setState in callback is intentional
  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      billingService.getStatus().then((status) => {
        if (!cancelled) {
          setBillingStatus(status);
        }
      }).catch(() => {
        // Silently fail - billing might not be set up yet
      });
    } else {
      // Reset billing when logged out - this is intentional
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBillingStatus(null);
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Memoize derived billing values
  const billingValues = useMemo(() => {
    const isPremium = billingStatus?.subscription_status === "active";
    const canCreateGift = billingStatus?.can_create_gift ?? true;
    const giftsRemaining = billingStatus?.gifts_remaining ?? FREE_GIFT_LIMIT;
    return { isPremium, canCreateGift, giftsRemaining };
  }, [billingStatus]);

  // Memoize the entire context value
  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      signOut,
      billingStatus,
      ...billingValues,
      refreshBillingStatus,
    }),
    [user, isLoading, isAuthenticated, signOut, billingStatus, billingValues, refreshBillingStatus]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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

/**
 * Noop auth provider for build-time rendering when Clerk is not available.
 * Provides safe defaults that prevent errors during static generation.
 */
export function NoopAuthProvider({ children }: { children: ReactNode }) {
  const noopValue: AuthContextType = {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    signOut: async () => {},
    billingStatus: null,
    isPremium: false,
    canCreateGift: false,
    giftsRemaining: null,
    refreshBillingStatus: async () => {},
  };

  return (
    <AuthContext.Provider value={noopValue}>{children}</AuthContext.Provider>
  );
}
