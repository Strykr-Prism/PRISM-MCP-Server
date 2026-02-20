import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerMarketTools(server: McpServer) {
  server.tool(
    "get_price",
    "Get the consensus price for any crypto asset. Aggregates across sources for accuracy.",
    {
      symbol: z.string().describe("Crypto ticker or name (e.g. 'BTC', 'ETH', 'SOL')"),
      include_sources: z.boolean().optional().describe("Include per-source price breakdown"),
    },
    async ({ symbol, include_sources }) => {
      const result = await prism.crypto.getPrice(symbol, { include_sources });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_trending",
    "Get trending crypto assets by volume, social buzz, and price action.",
    {
      include_pools: z.boolean().optional().describe("Include trending DEX pools"),
      include_solana: z.boolean().optional().describe("Include Solana bonding/graduated tokens"),
      limit_per_source: z.number().optional().describe("Max results per source"),
    },
    async ({ include_pools, include_solana, limit_per_source }) => {
      const result = await prism.crypto.getAllTrending({
        include_pools,
        include_solana,
        limit_per_source,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "market_overview",
    "Get a full crypto market overview: global stats, fear & greed index, top gainers and losers.",
    {
      include_trending: z.boolean().optional().describe("Include trending assets"),
      include_movers: z.boolean().optional().describe("Include top gainers/losers"),
      movers_limit: z.number().optional().describe("Number of movers to return"),
    },
    async ({ include_trending, include_movers, movers_limit }) => {
      const [overview, global, fearGreed] = await Promise.all([
        prism.crypto.getMarketOverview({ include_trending, include_movers, movers_limit }),
        prism.crypto.getGlobal(),
        prism.crypto.getFearGreed(),
      ]);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ overview, global, fear_greed: fearGreed }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "get_stock_quote",
    "Get a real-time stock quote with price, change, volume, and market cap.",
    {
      symbol: z.string().describe("Stock ticker (e.g. 'AAPL', 'TSLA', 'NVDA')"),
    },
    async ({ symbol }) => {
      const result = await prism.stocks.getQuote(symbol);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
