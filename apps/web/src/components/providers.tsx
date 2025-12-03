"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider, NoopAuthProvider } from "@/contexts/auth-context";
import { clerkAppearance } from "@/services";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

// Check if we have a valid Clerk publishable key (not a dummy build key)
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey =
  publishableKey && !publishableKey.includes("dummy_key");

/**
 * Client-side providers wrapper.
 * Wraps the app with Clerk and Auth providers.
 * Uses NoopAuthProvider during build when no valid key exists.
 */
export function Providers({ children }: ProvidersProps) {
  if (!hasValidClerkKey) {
    return <NoopAuthProvider>{children}</NoopAuthProvider>;
  }

  return (
    <ClerkProvider appearance={clerkAppearance}>
      <AuthProvider>{children}</AuthProvider>
    </ClerkProvider>
  );
}

