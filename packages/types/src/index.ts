// =============================================================================
// Base Types
// =============================================================================

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface BaseEntity extends Timestamps {
  id: number;
}

// =============================================================================
// User & Authentication
// =============================================================================

export type SubscriptionPlan = "free" | "premium";
export type SubscriptionStatus = "free" | "active" | "expired";

export interface User extends BaseEntity {
  email: string;
  clerk_user_id: string;
  first_name: string | null;
  last_name: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_expires_at: string | null;
  gift_count: number;
  gifts_remaining: number | null; // null = unlimited (premium)
  can_create_gift: boolean;
  subscription_status: SubscriptionStatus;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface SignOutResponse {
  message: string;
}

// =============================================================================
// Person
// =============================================================================

export const RELATIONSHIP_CATEGORIES = [
  "family",
  "friends",
  "co-workers",
  "vendors",
  "partners",
  "investors",
  "lovers",
] as const;

export type RelationshipCategory = (typeof RELATIONSHIP_CATEGORIES)[number];

export interface Person extends BaseEntity {
  name: string;
  relationship: string | null;
  age: number | null;
  gender: string | null;
  gift_count: number;
  user_id: number;
  is_mine: boolean;
  is_shared: boolean;
}

export interface PersonWithGifts extends Person {
  gifts_received: Gift[];
  gifts_given: Gift[];
}

export interface CreatePersonRequest {
  person: {
    name: string;
    relationship?: string;
    age?: number;
    gender?: string;
  };
}

export interface UpdatePersonRequest {
  person: Partial<CreatePersonRequest["person"]>;
}

// =============================================================================
// Gift Status
// =============================================================================

export interface GiftStatus extends BaseEntity {
  name: string;
  position: number;
}

export interface CreateGiftStatusRequest {
  gift_status: {
    name: string;
    position: number;
  };
}

export interface UpdateGiftStatusRequest {
  gift_status: Partial<CreateGiftStatusRequest["gift_status"]>;
}

// =============================================================================
// Holiday
// =============================================================================

export type HolidayRole = "owner" | "collaborator";

export interface Holiday extends BaseEntity {
  name: string;
  date: string | null; // ISO date string (YYYY-MM-DD), null for templates
  icon: string | null; // Lucide icon name
  is_template: boolean;
  completed: boolean;
  share_token: string | null; // Only visible to owner
  is_owner: boolean;
  role: HolidayRole | null;
  collaborator_count: number;
}

export interface HolidayCollaborator {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  role: HolidayRole;
}

export interface HolidayWithGifts extends Holiday {
  gifts: Gift[];
}

export interface HolidayWithCollaborators extends Holiday {
  collaborators: HolidayCollaborator[];
}

export interface CreateHolidayRequest {
  holiday: {
    name: string;
    date: string;
    icon?: string;
    completed?: boolean;
  };
}

export interface UpdateHolidayRequest {
  holiday: Partial<CreateHolidayRequest["holiday"]>;
}

export interface ShareLinkResponse {
  share_token: string;
  share_url: string;
}

export interface JoinHolidayRequest {
  share_token: string;
}

export interface JoinHolidayResponse extends Holiday {}


// =============================================================================
// Gift
// =============================================================================

export interface GiftCreator {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  safe_name: string;
}

export interface Gift extends BaseEntity {
  name: string;
  description: string | null;
  link: string | null;
  cost: string | null; // Decimal comes as string from Rails
  holiday_id: number;
  gift_status_id: number;
  position: number;
  gift_status: GiftStatus;
  holiday: Holiday;
  recipients: Person[];
  givers: Person[];
  created_by: GiftCreator | null;
  is_mine: boolean;
}

export interface GiftSummary extends BaseEntity {
  name: string;
  description: string | null;
  link: string | null;
  cost: string | null;
  holiday_id: number;
  gift_status_id: number;
  gift_status: GiftStatus;
}

export interface CreateGiftRequest {
  gift: {
    name: string;
    description?: string;
    link?: string;
    cost?: number;
    holiday_id: number;
    gift_status_id: number;
    position?: number;
    recipient_ids?: number[];
    giver_ids?: number[];
  };
}

export interface UpdateGiftRequest {
  gift: Partial<CreateGiftRequest["gift"]>;
}

// =============================================================================
// Join Tables (for reference, typically not returned directly)
// =============================================================================

export interface GiftGiver extends BaseEntity {
  gift_id: number;
  person_id: number;
}

export interface GiftRecipient extends BaseEntity {
  gift_id: number;
  person_id: number;
}

export interface HolidayUser extends BaseEntity {
  holiday_id: number;
  user_id: number;
  role: HolidayRole;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiError {
  error?: string;
  errors?: string[];
}

export interface ValidationError {
  errors: string[];
}

// List responses (arrays)
export type UsersResponse = User[];
export type PeopleResponse = Person[];
export type HolidaysResponse = Holiday[];
export type GiftsResponse = Gift[];
export type GiftStatusesResponse = GiftStatus[];

// =============================================================================
// API Endpoints (for documentation/type-safety)
// =============================================================================

export const API_ENDPOINTS = {
  // Auth
  signUp: "/users",
  signIn: "/users/sign_in",
  signOut: "/users/sign_out",

  // People
  people: "/people",
  person: (id: number) => `/people/${id}`,

  // Holidays
  holidays: "/holidays",
  holidayTemplates: "/holidays/templates",
  holiday: (id: number) => `/holidays/${id}`,
  holidayShare: (id: number) => `/holidays/${id}/share`,
  holidayJoin: "/holidays/join",
  holidayLeave: (id: number) => `/holidays/${id}/leave`,
  holidayCollaborators: (id: number) => `/holidays/${id}/collaborators`,
  holidayRemoveCollaborator: (id: number, userId: number) =>
    `/holidays/${id}/collaborators/${userId}`,

  // Gifts
  gifts: "/gifts",
  gift: (id: number) => `/gifts/${id}`,

  // Gift Statuses
  giftStatuses: "/gift_statuses",
  giftStatus: (id: number) => `/gift_statuses/${id}`,

  // Billing
  billingStatus: "/billing/status",
  createCheckoutSession: "/billing/create_checkout_session",

  // Gift Suggestions
  giftSuggestions: (personId: number) => `/people/${personId}/gift_suggestions`,
  refineGiftSuggestions: (personId: number) => `/people/${personId}/gift_suggestions/refine`,
  giftSuggestion: (id: number) => `/gift_suggestions/${id}`,
  acceptGiftSuggestion: (id: number) => `/gift_suggestions/${id}/accept`,
} as const;

// =============================================================================
// Gift Filters
// =============================================================================

export interface GiftFilterState {
  search: string;
  statusIds: number[];
  recipientIds: number[];
  giverIds: number[];
  costRange: CostRange | null;
}

export type CostRange = "under25" | "25to50" | "50to100" | "over100" | "custom";

export interface CostRangeCustom {
  min: number | null;
  max: number | null;
}

export const COST_RANGE_LABELS: Record<CostRange, string> = {
  under25: "Under $25",
  "25to50": "$25 - $50",
  "50to100": "$50 - $100",
  over100: "Over $100",
  custom: "Custom",
};

export const DEFAULT_GIFT_FILTERS: GiftFilterState = {
  search: "",
  statusIds: [],
  recipientIds: [],
  giverIds: [],
  costRange: null,
};

// =============================================================================
// Billing
// =============================================================================

export type BillingPlan = "yearly" | "two_year";

export interface BillingStatus {
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: string | null;
  gift_count: number;
  gifts_remaining: number | null;
  can_create_gift: boolean;
  free_limit: number;
}

export interface CheckoutSessionRequest {
  plan: BillingPlan;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface GiftLimitError {
  error: string;
  message: string;
  gifts_remaining: number;
  upgrade_required: boolean;
}

export interface CouponRedemptionRequest {
  code: string;
}

export interface CouponRedemptionResponse {
  success: boolean;
  message: string;
  animation: "christmas" | null;
  subscription_expires_at: string;
}

export interface CharityStats {
  fuzzy_raised_amount: string;
  milestone_description: string;
  charity_percentage: number;
  currency: string;
}

export const BILLING_PLANS = {
  yearly: {
    id: "yearly" as const,
    name: "1 Year",
    price: 25,
    pricePerDay: 0.068,
    currency: "CAD",
    years: 1,
    savings: null,
  },
  two_year: {
    id: "two_year" as const,
    name: "2 Years",
    price: 40,
    pricePerDay: 0.055,
    currency: "CAD",
    years: 2,
    savings: 10,
  },
} as const;

export const FREE_GIFT_LIMIT = 10;

// =============================================================================
// Gift Suggestions (AI-powered, Premium feature)
// =============================================================================

export interface GiftSuggestion extends BaseEntity {
  name: string;
  description: string | null;
  approximate_price: string | null;
  person_id: number;
  holiday_id: number | null;
  holiday: Holiday | null;
}

export type GiftSuggestionsResponse = GiftSuggestion[];

export interface GiftSuggestionPremiumError {
  error: string;
  message: string;
  upgrade_required: boolean;
}

export interface RefineForHolidayRequest {
  suggestion_ids: number[];
  holiday_id: number;
}

// =============================================================================
// Utility Types
// =============================================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}
