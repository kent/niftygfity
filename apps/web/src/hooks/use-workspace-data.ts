"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useWorkspace } from "@/contexts/workspace-context";
import { AUTH_ROUTES } from "@/services";

interface UseWorkspaceDataOptions<T> {
  /** Function to fetch data - called when workspace changes */
  fetcher: () => Promise<T>;
  /** Initial data value */
  initialData?: T;
  /** Whether to redirect to sign in if not authenticated (default: true) */
  requireAuth?: boolean;
}

interface UseWorkspaceDataResult<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  user: ReturnType<typeof useAuth>["user"];
  signOut: ReturnType<typeof useAuth>["signOut"];
}

/**
 * Hook for loading workspace-scoped data that automatically refetches when workspace changes.
 * Handles authentication, loading states, and error handling.
 */
export function useWorkspaceData<T>({
  fetcher,
  initialData,
  requireAuth = true,
}: UseWorkspaceDataOptions<T>): UseWorkspaceDataResult<T> {
  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const { currentWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const router = useRouter();

  const [data, setData] = useState<T>(initialData as T);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track the fetcher to avoid stale closures
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (requireAuth && !authLoading && !isAuthenticated) {
      router.push(AUTH_ROUTES.signIn);
    }
  }, [authLoading, isAuthenticated, requireAuth, router]);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data. Please try again.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Reload data when workspace changes
  useEffect(() => {
    if (!isAuthenticated || !currentWorkspace) return;
    loadData();
  }, [isAuthenticated, currentWorkspace, loadData]);

  const isLoading = authLoading || workspaceLoading || dataLoading;

  return {
    data,
    setData,
    isLoading,
    error,
    refetch: loadData,
    user,
    signOut,
  };
}
