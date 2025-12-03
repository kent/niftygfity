"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AUTH_ROUTES } from "@/services";

/**
 * Client component to handle auth-based redirects.
 * Used on public pages to redirect authenticated users to dashboard.
 */
export function AuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(AUTH_ROUTES.afterSignIn);
    }
  }, [isLoading, isAuthenticated, router]);

  return null;
}

