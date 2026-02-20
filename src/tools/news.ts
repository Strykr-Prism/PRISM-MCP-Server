import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerNewsTools(server: McpServer) {
  server.tool(
    "get_news",
    "Get the latest crypto and stock market news with sentiment analysis.",
    {
      category: z.enum(["crypto", "stocks"]).optional().describe("News category. Default: 'crypto'"),
      symbol: z.string().optional().describe("Filter stock news by ticker (only for stocks category)"),
      limit: z.number().optional().describe("Max articles (default 20)"),
    },
    async ({ category, symbol, limit }) => {
      const cat = category ?? "crypto";
      const result = cat === "stocks"
        ? await prism.news.getStockNews(symbol, limit)
        : await prism.news.getCryptoNews(limit);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "social_sentiment",
    "Get social media sentiment for a crypto asset: bullish/bearish ratio, mention volume, and trending score.",
    {
      symbol: z.string().describe("Crypto symbol (e.g. 'BTC', 'ETH', 'SOL')"),
    },
    async ({ symbol }) => {
      const [sentiment, mentions, trending] = await Promise.all([
        prism.social.getSentiment(symbol),
        prism.social.getMentions(symbol),
        prism.social.getTrendingScore(symbol),
      ]);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ sentiment, mentions, trending }, null, 2),
        }],
      };
    }
  );
}
