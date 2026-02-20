import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { prism } from "../client.js";

export function registerMacroTools(server: McpServer) {
  server.tool(
    "macro_summary",
    "Get a macroeconomic dashboard: Fed rate, inflation, GDP, unemployment, treasury yields, and yield curve status.",
    {},
    async () => {
      const result = await prism.macro.getSummary();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
