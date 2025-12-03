import type { User, BillingStatus } from "@niftygifty/types";
import type { UserResource } from "@clerk/types";
import { dark } from "@clerk/themes";

// =============================================================================
// Route Configuration
// =============================================================================

export const AUTH_ROUTES = {
  signIn: "/login",
  signUp: "/signup",
  afterSignIn: "/dashboard",
  afterSignUp: "/dashboard",
} as const;

export const PUBLIC_ROUTES = [
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/giving-pledge",
  "/billing(.*)",
] as const;

// =============================================================================
// Clerk Appearance Configuration
// =============================================================================

export const clerkAppearance = {
  baseTheme: dark,
  variables: { colorPrimary: "#8b5cf6" },
  elements: {
    card: "bg-slate-900/80 backdrop-blur-sm border-slate-800",
    formButtonPrimary:
      "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500",
    footerActionLink: "text-violet-400 hover:text-violet-300",
  },
} as const;

// =============================================================================
// User Mapping
// =============================================================================

/**
 * Maps a Clerk user to our internal User type.
 * Billing fields are populated from billingStatus if available.
 */
export function mapClerkUser(
  clerkUser: UserResource | null | undefined,
  billingStatus: BillingStatus | null = null
): User | null {
  if (!clerkUser) return null;

  return {
    id: 0, // Internal ID not available without backend fetch
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    clerk_user_id: clerkUser.id,
    subscription_plan: billingStatus?.subscription_plan || "free",
    subscription_expires_at: billingStatus?.subscription_expires_at || null,
    gift_count: billingStatus?.gift_count || 0,
    gifts_remaining: billingStatus?.gifts_remaining ?? null,
    can_create_gift: billingStatus?.can_create_gift ?? true,
    subscription_status: billingStatus?.subscription_status || "free",
    created_at: clerkUser.createdAt?.toISOString() || "",
    updated_at: clerkUser.updatedAt?.toISOString() || "",
  };
}

// =============================================================================
// Auth Service (singleton pattern for consistency with other services)
// =============================================================================

class AuthService {
  readonly routes = AUTH_ROUTES;
  readonly publicRoutes = PUBLIC_ROUTES;
  readonly appearance = clerkAppearance;

  mapUser = mapClerkUser;
}

export const authService = new AuthService();

