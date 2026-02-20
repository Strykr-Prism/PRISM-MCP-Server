import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerDefiTools(server: McpServer) {
  server.tool(
    "get_yields",
    "Get top DeFi yield opportunities across chains. Filter by chain, minimum APY, TVL, and stablecoin-only pools.",
    {
      chain: z.string().optional().describe("Filter by chain (e.g. 'ethereum', 'arbitrum')"),
      min_tvl: z.number().optional().describe("Minimum TVL in USD"),
      min_apy: z.number().optional().describe("Minimum APY percentage"),
      stablecoin: z.boolean().optional().describe("Only stablecoin pools"),
      limit: z.number().optional().describe("Max results (default 20)"),
    },
    async ({ chain, min_tvl, min_apy, stablecoin, limit }) => {
      const result = await prism.defi.getYields({ chain, min_tvl, min_apy, stablecoin, limit });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_protocols",
    "List DeFi protocols with TVL, category, and chain information.",
    {
      category: z.string().optional().describe("Protocol category (e.g. 'DEX', 'Lending', 'Yield')"),
      chain: z.string().optional().describe("Filter by chain"),
      min_tvl: z.number().optional().describe("Minimum TVL in USD"),
      limit: z.number().optional().describe("Max results"),
    },
    async ({ category, chain, min_tvl, limit }) => {
      const result = await prism.defi.getProtocols({ category, chain, min_tvl, limit });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_gas",
    "Get current gas prices across all supported chains.",
    {},
    async () => {
      const result = await prism.defi.getAllGas();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
