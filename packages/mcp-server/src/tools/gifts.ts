import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { ApiClient } from "../client.js";
import type { Gift } from "../types.js";

export const giftTools: Tool[] = [
  {
    name: "niftygifty_list_gifts",
    description:
      "List gifts, optionally filtered by holiday, status, or recipient.",
    inputSchema: {
      type: "object",
      properties: {
        holiday_id: {
          type: "number",
          description: "Filter by holiday ID",
        },
      },
      required: [],
    },
  },
  {
    name: "niftygifty_get_gift",
    description: "Get details of a specific gift.",
    inputSchema: {
      type: "object",
      properties: {
        gift_id: {
          type: "number",
          description: "The gift ID",
        },
      },
      required: ["gift_id"],
    },
  },
  {
    name: "niftygifty_create_gift",
    description: "Create a new gift entry.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Gift name",
        },
        description: {
          type: "string",
          description: "Gift description",
        },
        link: {
          type: "string",
          description: "URL to purchase the gift",
        },
        cost: {
          type: "number",
          description: "Gift cost/price",
        },
        holiday_id: {
          type: "number",
          description: "Holiday to add the gift to",
        },
        gift_status_id: {
          type: "number",
          description: "Initial status ID (use list_gift_statuses to see options)",
        },
        recipient_ids: {
          type: "array",
          items: { type: "number" },
          description: "IDs of people receiving this gift",
        },
        giver_ids: {
          type: "array",
          items: { type: "number" },
          description: "IDs of people giving this gift",
        },
      },
      required: ["name", "holiday_id", "gift_status_id"],
    },
  },
  {
    name: "niftygifty_update_gift",
    description: "Update an existing gift.",
    inputSchema: {
      type: "object",
      properties: {
        gift_id: {
          type: "number",
          description: "The gift ID to update",
        },
        name: {
          type: "string",
          description: "New gift name",
        },
        description: {
          type: "string",
          description: "New description",
        },
        link: {
          type: "string",
          description: "New purchase URL",
        },
        cost: {
          type: "number",
          description: "New cost",
        },
        gift_status_id: {
          type: "number",
          description: "New status ID",
        },
        recipient_ids: {
          type: "array",
          items: { type: "number" },
          description: "New recipient IDs",
        },
        giver_ids: {
          type: "array",
          items: { type: "number" },
          description: "New giver IDs",
        },
      },
      required: ["gift_id"],
    },
  },
  {
    name: "niftygifty_delete_gift",
    description: "Delete a gift.",
    inputSchema: {
      type: "object",
      properties: {
        gift_id: {
          type: "number",
          description: "The gift ID to delete",
        },
      },
      required: ["gift_id"],
    },
  },
  {
    name: "niftygifty_reorder_gift",
    description: "Change the position of a gift within its holiday.",
    inputSchema: {
      type: "object",
      properties: {
        gift_id: {
          type: "number",
          description: "The gift ID",
        },
        position: {
          type: "number",
          description: "New position (0-based index)",
        },
      },
      required: ["gift_id", "position"],
    },
  },
];

export async function handleGiftTool(
  client: ApiClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "niftygifty_list_gifts": {
      let endpoint = "/gifts";
      const params: string[] = [];
      if (args.holiday_id) {
        params.push(`holiday_id=${args.holiday_id}`);
      }
      if (params.length > 0) {
        endpoint += `?${params.join("&")}`;
      }
      const gifts = await client.get<Gift[]>(endpoint);
      return gifts;
    }

    case "niftygifty_get_gift": {
      const giftId = args.gift_id as number;
      const gift = await client.get<Gift>(`/gifts/${giftId}`);
      return gift;
    }

    case "niftygifty_create_gift": {
      const giftData: Record<string, unknown> = {
        name: args.name,
        holiday_id: args.holiday_id,
        gift_status_id: args.gift_status_id,
      };
      if (args.description) giftData.description = args.description;
      if (args.link) giftData.link = args.link;
      if (args.cost) giftData.cost = args.cost;
      if (args.recipient_ids) giftData.recipient_ids = args.recipient_ids;
      if (args.giver_ids) giftData.giver_ids = args.giver_ids;

      const gift = await client.post<Gift>("/gifts", { gift: giftData });
      return {
        message: `Created gift: ${gift.name}`,
        gift,
      };
    }

    case "niftygifty_update_gift": {
      const giftId = args.gift_id as number;
      const updateData: Record<string, unknown> = {};
      if (args.name !== undefined) updateData.name = args.name;
      if (args.description !== undefined)
        updateData.description = args.description;
      if (args.link !== undefined) updateData.link = args.link;
      if (args.cost !== undefined) updateData.cost = args.cost;
      if (args.gift_status_id !== undefined)
        updateData.gift_status_id = args.gift_status_id;
      if (args.recipient_ids !== undefined)
        updateData.recipient_ids = args.recipient_ids;
      if (args.giver_ids !== undefined) updateData.giver_ids = args.giver_ids;

      const gift = await client.patch<Gift>(`/gifts/${giftId}`, {
        gift: updateData,
      });
      return {
        message: `Updated gift: ${gift.name}`,
        gift,
      };
    }

    case "niftygifty_delete_gift": {
      const giftId = args.gift_id as number;
      await client.delete(`/gifts/${giftId}`);
      return {
        message: "Gift deleted successfully",
      };
    }

    case "niftygifty_reorder_gift": {
      const giftId = args.gift_id as number;
      const position = args.position as number;
      const gift = await client.patch<Gift>(`/gifts/${giftId}/reorder`, {
        position,
      });
      return {
        message: `Moved gift to position ${position}`,
        gift,
      };
    }

    default:
      throw new Error(`Unknown gift tool: ${toolName}`);
  }
}
