import type { CharityStats } from "@niftygifty/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Server-side data fetching for public pages.
 * Uses Next.js fetch caching for performance.
 */

export async function getCharityStats(): Promise<CharityStats | null> {
  // Skip fetching if in Vercel build and API URL is not set or localhost
  // This prevents build failures when the API is not running
  const isVercelBuild = process.env.VERCEL === "1";
  const isLocalhost = API_URL.includes("localhost");
  
  if (isVercelBuild && (!process.env.NEXT_PUBLIC_API_URL || isLocalhost)) {
    console.warn("Skipping charity stats fetch during Vercel build (API not available)");
    return null;
  }

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

