import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { ApiClient } from "../client.js";
import type { GiftStatus } from "../types.js";

export const statusTools: Tool[] = [
  {
    name: "niftygifty_list_gift_statuses",
    description:
      "List all available gift statuses (Idea, Purchased, Wrapped, etc.).",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "niftygifty_create_gift_status",
    description: "Create a custom gift status.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Status name (e.g., 'Shipped', 'Delivered')",
        },
        position: {
          type: "number",
          description: "Order in the workflow (lower numbers come first)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "niftygifty_update_gift_status",
    description: "Update a gift status.",
    inputSchema: {
      type: "object",
      properties: {
        status_id: {
          type: "number",
          description: "The status ID to update",
        },
        name: {
          type: "string",
          description: "New name",
        },
        position: {
          type: "number",
          description: "New position",
        },
      },
      required: ["status_id"],
    },
  },
  {
    name: "niftygifty_delete_gift_status",
    description: "Delete a gift status.",
    inputSchema: {
      type: "object",
      properties: {
        status_id: {
          type: "number",
          description: "The status ID to delete",
        },
      },
      required: ["status_id"],
    },
  },
];

export async function handleStatusTool(
  client: ApiClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "niftygifty_list_gift_statuses": {
      const statuses = await client.get<GiftStatus[]>("/gift_statuses");
      return statuses;
    }

    case "niftygifty_create_gift_status": {
      const statusData: Record<string, unknown> = {
        name: args.name,
      };
      if (args.position !== undefined) {
        statusData.position = args.position;
      }

      const status = await client.post<GiftStatus>("/gift_statuses", {
        gift_status: statusData,
      });
      return {
        message: `Created status: ${status.name}`,
        status,
      };
    }

    case "niftygifty_update_gift_status": {
      const statusId = args.status_id as number;
      const updateData: Record<string, unknown> = {};
      if (args.name !== undefined) updateData.name = args.name;
      if (args.position !== undefined) updateData.position = args.position;

      const status = await client.patch<GiftStatus>(
        `/gift_statuses/${statusId}`,
        { gift_status: updateData }
      );
      return {
        message: `Updated status: ${status.name}`,
        status,
      };
    }

    case "niftygifty_delete_gift_status": {
      const statusId = args.status_id as number;
      await client.delete(`/gift_statuses/${statusId}`);
      return {
        message: "Status deleted successfully",
      };
    }

    default:
      throw new Error(`Unknown status tool: ${toolName}`);
  }
}
