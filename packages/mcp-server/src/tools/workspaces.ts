import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { ApiClient } from "../client.js";
import type { Workspace } from "../types.js";

// WorkspaceWithMembers includes member details
interface WorkspaceWithMembers extends Workspace {
  members: Array<{
    id: number;
    user_id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
  }>;
}

export const workspaceTools: Tool[] = [
  {
    name: "niftygifty_list_workspaces",
    description:
      "List all workspaces the user has access to. Returns personal and business workspaces with member counts.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "niftygifty_switch_workspace",
    description:
      "Switch to a different workspace context. All subsequent operations will use this workspace.",
    inputSchema: {
      type: "object",
      properties: {
        workspace_id: {
          type: "number",
          description: "The ID of the workspace to switch to",
        },
      },
      required: ["workspace_id"],
    },
  },
  {
    name: "niftygifty_get_workspace",
    description:
      "Get details of a specific workspace including member information.",
    inputSchema: {
      type: "object",
      properties: {
        workspace_id: {
          type: "number",
          description: "The workspace ID",
        },
      },
      required: ["workspace_id"],
    },
  },
];

export async function handleWorkspaceTool(
  client: ApiClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "niftygifty_list_workspaces": {
      const workspaces = await client.get<Workspace[]>("/workspaces");
      return {
        workspaces,
        current_workspace_id: client.getWorkspaceId(),
      };
    }

    case "niftygifty_switch_workspace": {
      const workspaceId = args.workspace_id as number;
      // Verify workspace exists and user has access
      const workspace = await client.get<WorkspaceWithMembers>(
        `/workspaces/${workspaceId}`
      );
      client.setWorkspaceId(workspaceId);
      return {
        message: `Switched to workspace: ${workspace.name}`,
        workspace,
      };
    }

    case "niftygifty_get_workspace": {
      const workspaceId = args.workspace_id as number;
      const workspace = await client.get<WorkspaceWithMembers>(
        `/workspaces/${workspaceId}`
      );
      return workspace;
    }

    default:
      throw new Error(`Unknown workspace tool: ${toolName}`);
  }
}
