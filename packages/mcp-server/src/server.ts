import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ApiClient } from "./client.js";
import { allTools, handleToolCall } from "./tools/index.js";
import { mcpResources, handleResourceRead } from "./resources/index.js";

export interface ServerConfig {
  apiUrl: string;
  apiKey: string;
}

export function createServer(config: ServerConfig, client: ApiClient): Server {
  const server = new Server(
    {
      name: "niftygifty-mcp",
      version: "0.0.1",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleToolCall(client, name, args || {});
  });

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: mcpResources,
  }));

  // Read resource content
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    return handleResourceRead(client, uri);
  });

  return server;
}
