import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerResolutionTools(server: McpServer) {
  server.tool(
    "resolve_asset",
    "Resolve any ticker, name, or contract address to a canonical PRISM asset. Returns unified identity with price, chain, and venue data.",
    {
      symbol: z.string().describe("Ticker, name, or contract address (e.g. 'BTC', 'Ethereum', '0x...')"),
      context: z.string().optional().describe("Disambiguation hint (e.g. 'DeFi yield token on Arbitrum')"),
      chain: z.string().optional().describe("Filter to a specific chain"),
      expand: z.boolean().optional().describe("Include venues and instances"),
      live_price: z.boolean().optional().describe("Attach live price to response"),
    },
    async ({ symbol, context, chain, expand, live_price }) => {
      const result = await prism.resolve.resolve(symbol, {
        context,
        chain,
        expand,
        live_price,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "batch_resolve",
    "Resolve multiple symbols at once. Pass an array of tickers, names, or addresses.",
    {
      symbols: z.array(z.string()).describe("Array of symbols to resolve"),
      context: z.string().optional().describe("Shared disambiguation context"),
      expand: z.boolean().optional().describe("Include venues and instances"),
    },
    async ({ symbols, context, expand }) => {
      const result = await prism.resolve.resolveBatch(symbols, { context, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
