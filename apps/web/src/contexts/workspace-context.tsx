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
import type { Workspace } from "@niftygifty/types";
import { useAuth } from "./auth-context";
import { workspacesService } from "@/services";
import { apiClient } from "@/lib/api-client";

const WORKSPACE_STORAGE_KEY = "niftygifty_current_workspace_id";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  personalWorkspace: Workspace | null;
  businessWorkspaces: Workspace[];
  switchWorkspace: (workspaceId: number) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshWorkspaces = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await workspacesService.getAll();
      setWorkspaces(data);

      // If no current workspace selected, default to saved or personal
      if (!currentWorkspaceId) {
        const savedId = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        const saved = savedId
          ? data.find((w) => w.id === parseInt(savedId, 10))
          : null;
        const personal = data.find((w) => w.workspace_type === "personal");
        const newWorkspaceId = saved?.id || personal?.id || data[0]?.id || null;
        setCurrentWorkspaceId(newWorkspaceId);

        // Update API client with workspace header
        if (newWorkspaceId) {
          apiClient.setWorkspaceId(newWorkspaceId);
        }
      }
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentWorkspaceId]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshWorkspaces();
    } else if (!authLoading && !isAuthenticated) {
      setWorkspaces([]);
      setCurrentWorkspaceId(null);
      apiClient.setWorkspaceId(null);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, refreshWorkspaces]);

  const switchWorkspace = useCallback((workspaceId: number) => {
    setCurrentWorkspaceId(workspaceId);
    localStorage.setItem(WORKSPACE_STORAGE_KEY, String(workspaceId));
    apiClient.setWorkspaceId(workspaceId);
  }, []);

  const currentWorkspace = useMemo(
    () => workspaces.find((w) => w.id === currentWorkspaceId) || null,
    [workspaces, currentWorkspaceId]
  );

  const personalWorkspace = useMemo(
    () => workspaces.find((w) => w.workspace_type === "personal") || null,
    [workspaces]
  );

  const businessWorkspaces = useMemo(
    () => workspaces.filter((w) => w.workspace_type === "business"),
    [workspaces]
  );

  const contextValue = useMemo<WorkspaceContextType>(
    () => ({
      workspaces,
      currentWorkspace,
      isLoading: isLoading || authLoading,
      personalWorkspace,
      businessWorkspaces,
      switchWorkspace,
      refreshWorkspaces,
    }),
    [
      workspaces,
      currentWorkspace,
      isLoading,
      authLoading,
      personalWorkspace,
      businessWorkspaces,
      switchWorkspace,
      refreshWorkspaces,
    ]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

/**
 * Noop workspace provider for build-time rendering.
 */
export function NoopWorkspaceProvider({ children }: { children: ReactNode }) {
  const noopValue: WorkspaceContextType = {
    workspaces: [],
    currentWorkspace: null,
    isLoading: true,
    personalWorkspace: null,
    businessWorkspaces: [],
    switchWorkspace: () => {},
    refreshWorkspaces: async () => {},
  };

  return (
    <WorkspaceContext.Provider value={noopValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}
