import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { prism } from "../client.js";

export function registerDeveloperTools(server: McpServer) {
  server.tool(
    "api_health",
    "Check PRISM API health status and service availability.",
    {},
    async () => {
      const result = await prism.developer.getHealth();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
