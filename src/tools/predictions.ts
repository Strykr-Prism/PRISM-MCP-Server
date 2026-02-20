import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerPredictionTools(server: McpServer) {
  server.tool(
    "prediction_markets",
    "Get trending prediction markets from Polymarket, Kalshi, and Manifold.",
    {
      limit: z.number().optional().describe("Max results (default 20)"),
    },
    async ({ limit }) => {
      const result = await prism.predictions.getTrending(limit);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "search_predictions",
    "Search prediction markets by query. Find markets about elections, crypto, sports, and more.",
    {
      query: z.string().describe("Search query (e.g. 'Bitcoin 100k', 'US election')"),
      category: z.string().optional().describe("Filter by category"),
      source: z.string().optional().describe("Platform: 'polymarket', 'kalshi', or 'manifold'"),
      limit: z.number().optional().describe("Max results"),
    },
    async ({ query, category, source, limit }) => {
      const result = await prism.predictions.searchMarkets(query, { category, source, limit });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
