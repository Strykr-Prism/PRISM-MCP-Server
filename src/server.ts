import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerResolutionTools } from "./tools/resolution.js";
import { registerMarketTools } from "./tools/market.js";
import { registerDefiTools } from "./tools/defi.js";
import { registerOnchainTools } from "./tools/onchain.js";
import { registerAnalysisTools } from "./tools/analysis.js";
import { registerNewsTools } from "./tools/news.js";
import { registerPredictionTools } from "./tools/predictions.js";
import { registerMacroTools } from "./tools/macro.js";
import { registerDeveloperTools } from "./tools/developer.js";
import { registerScaffoldTools } from "./tools/scaffold.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "prism-os",
    version: "1.0.0",
  });

  registerResolutionTools(server);
  registerMarketTools(server);
  registerDefiTools(server);
  registerOnchainTools(server);
  registerAnalysisTools(server);
  registerNewsTools(server);
  registerPredictionTools(server);
  registerMacroTools(server);
  registerDeveloperTools(server);
  registerScaffoldTools(server);

  return server;
}
