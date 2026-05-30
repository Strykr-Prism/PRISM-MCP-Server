import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";
import { RENDER_HINTS } from "../render-hints.js";

export function registerNewsTools(server: McpServer) {
  server.registerTool(
    "get_news",
    {
      description: "Get the latest crypto and stock market news with sentiment analysis.",
      inputSchema: {
        category: z.enum(["crypto", "stocks"]).optional().describe("News category. Default: 'crypto'"),
        symbol: z.string().optional().describe("Filter stock news by ticker (only for stocks category)"),
        limit: z.number().optional().describe("Max articles (default 20)"),
      },
      annotations: { readOnlyHint: true },
      _meta: { 'x-prism-ui': RENDER_HINTS.get_news },
    },
    async ({ category, symbol, limit }) => {
      const cat = category ?? "crypto";
      const result = cat === "stocks"
        ? await prism.news.getStockNews(symbol, limit)
        : await prism.news.getCryptoNews(limit);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ data: result, _ui: RENDER_HINTS.get_news }, null, 2),
        }],
      };
    }
  );

  // NOTE: `social_sentiment` is owned by the dedicated social module
  // (tools/social.ts), which also exposes social_mentions and trending_score
  // as discrete tools. It was previously duplicated here, breaking startup.
}
