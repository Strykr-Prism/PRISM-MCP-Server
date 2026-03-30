import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RENDER_HINTS } from "../render-hints.js";

const BASE_URL = "https://api.prismapi.ai";

export function registerHackathonTools(server: McpServer) {
  server.registerTool(
    "hackathon_status",
    {
      description:
        "Check the PRISM hackathon credit pool status — total spots, spots remaining, credits per user, and whether the hackathon is still active.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
      _meta: { "x-prism-ui": RENDER_HINTS.hackathon_status },
    },
    async () => {
      const res = await fetch(`${BASE_URL}/hackathon/status`);
      if (!res.ok) {
        throw new Error(`Hackathon status request failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { data, _ui: RENDER_HINTS.hackathon_status },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "hackathon_redeem",
    {
      description:
        "Redeem a hackathon code to receive $10 in PRISM API credits (1,000 API calls). Requires a valid PRISM API key for authentication.",
      inputSchema: {
        code: z.string().describe("The hackathon redemption code to redeem"),
      },
      annotations: { readOnlyHint: false },
      _meta: { "x-prism-ui": RENDER_HINTS.hackathon_redeem },
    },
    async ({ code }) => {
      const apiKey = process.env.PRISM_API_KEY;
      if (!apiKey) {
        throw new Error("PRISM_API_KEY is required to redeem a hackathon code");
      }
      const res = await fetch(`${BASE_URL}/hackathon/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Hackathon redeem failed (${res.status}): ${body}`);
      }
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { data, _ui: RENDER_HINTS.hackathon_redeem },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "hackathon_my_credits",
    {
      description:
        "Check your hackathon credit balance, usage, and redemption info. Requires a valid PRISM API key for authentication.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
      _meta: { "x-prism-ui": RENDER_HINTS.hackathon_my_credits },
    },
    async () => {
      const apiKey = process.env.PRISM_API_KEY;
      if (!apiKey) {
        throw new Error("PRISM_API_KEY is required to check hackathon credits");
      }
      const res = await fetch(`${BASE_URL}/hackathon/my`, {
        headers: { "X-API-Key": apiKey },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Hackathon credits check failed (${res.status}): ${body}`);
      }
      const data = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { data, _ui: RENDER_HINTS.hackathon_my_credits },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
