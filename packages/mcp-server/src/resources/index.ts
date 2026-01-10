import type { Resource, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ApiClient } from "../client.js";
import type {
  Holiday,
  Gift,
  Person,
  BillingStatus,
} from "../types.js";

export const mcpResources: Resource[] = [
  {
    uri: "niftygifty://dashboard/overview",
    name: "Dashboard Overview",
    description: "Current user's gift planning summary including upcoming holidays and pending gifts",
    mimeType: "application/json",
  },
  {
    uri: "niftygifty://holidays/upcoming",
    name: "Upcoming Holidays",
    description: "Holidays sorted by date with gift counts and completion status",
    mimeType: "application/json",
  },
  {
    uri: "niftygifty://gifts/pending",
    name: "Pending Gifts",
    description: "All gifts that haven't been completed yet",
    mimeType: "application/json",
  },
  {
    uri: "niftygifty://people/frequent",
    name: "Frequent Gift Recipients",
    description: "People who receive gifts most often",
    mimeType: "application/json",
  },
  {
    uri: "niftygifty://billing/status",
    name: "Subscription Status",
    description: "Current subscription plan, gift limits, and usage",
    mimeType: "application/json",
  },
];

export async function handleResourceRead(
  client: ApiClient,
  uri: string
): Promise<ReadResourceResult> {
  try {
    let content: unknown;

    switch (uri) {
      case "niftygifty://dashboard/overview": {
        // Fetch holidays, count pending gifts
        const holidays = await client.get<Holiday[]>("/holidays");
        const billingStatus = await client.get<BillingStatus>("/billing/status");

        const upcomingHolidays = holidays
          .filter((h) => !h.archived && h.date)
          .sort((a, b) =>
            new Date(a.date!).getTime() - new Date(b.date!).getTime()
          )
          .slice(0, 5);

        content = {
          upcoming_holidays: upcomingHolidays,
          total_holidays: holidays.filter((h) => !h.archived).length,
          subscription: {
            plan: billingStatus.subscription_plan,
            status: billingStatus.subscription_status,
            gift_count: billingStatus.gift_count,
            gifts_remaining: billingStatus.gifts_remaining,
          },
        };
        break;
      }

      case "niftygifty://holidays/upcoming": {
        const holidays = await client.get<Holiday[]>("/holidays");
        const upcomingHolidays = holidays
          .filter((h) => !h.archived && h.date)
          .sort((a, b) =>
            new Date(a.date!).getTime() - new Date(b.date!).getTime()
          );
        content = upcomingHolidays;
        break;
      }

      case "niftygifty://gifts/pending": {
        const gifts = await client.get<Gift[]>("/gifts");
        // Filter to gifts that aren't in a "completed" type status
        // This is a simplification - in reality you'd check the status name
        const pendingGifts = gifts.filter((g) => {
          const statusName = g.gift_status?.name?.toLowerCase() || "";
          return !statusName.includes("given") && !statusName.includes("complete");
        });
        content = pendingGifts;
        break;
      }

      case "niftygifty://people/frequent": {
        const people = await client.get<Person[]>("/people");
        // Sort by gift count descending
        const frequentPeople = [...people]
          .sort((a, b) => (b.gift_count || 0) - (a.gift_count || 0))
          .slice(0, 10);
        content = frequentPeople;
        break;
      }

      case "niftygifty://billing/status": {
        const billingStatus = await client.get<BillingStatus>("/billing/status");
        content = billingStatus;
        break;
      }

      default:
        throw new Error(`Unknown resource URI: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(content, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Error reading resource: ${message}`,
        },
      ],
    };
  }
}
