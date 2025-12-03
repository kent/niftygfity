import type { CharityStats } from "@niftygifty/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Server-side data fetching for public pages.
 * Uses Next.js fetch caching for performance.
 */

export async function getCharityStats(): Promise<CharityStats | null> {
  try {
    const res = await fetch(`${API_URL}/billing/charity_stats`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(`Failed to fetch charity stats: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching charity stats:", error);
    return null;
  }
}

// Default fallback for charity stats
export const DEFAULT_CHARITY_STATS: CharityStats = {
  fuzzy_raised_amount: "$0",
  milestone_description: "Every subscription helps us give back.",
  charity_percentage: 10,
  currency: "CAD",
};

