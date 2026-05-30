/**
 * Verifies the central MCP modernization applied in createServer():
 *  - the server boots with no duplicate-tool errors;
 *  - read-only tools gain idempotent + open-world hints and a human title;
 *  - every tool's JSON text output is mirrored as structuredContent.
 *
 * Exercises the real createServer() through the official MCP client over an
 * in-memory transport (the existing developer-tools test registers modules
 * directly and therefore bypasses the createServer() wrapper).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../server';

// Mock the prism client so importing the server doesn't require PRISM_API_KEY
// and tool handlers don't hit the network.
vi.mock('../client.js', () => ({
  prism: {
    developer: {
      getUsageStats: vi.fn(),
      getTiers: vi.fn(),
      verifyKey: vi.fn(),
      getHealth: vi.fn(),
    },
  },
}));

global.fetch = vi.fn();

describe('createServer modernization', () => {
  let server: ReturnType<typeof createServer>;
  let client: Client;

  beforeEach(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    server = createServer(); // throws if any tool is registered twice
    await server.connect(serverTransport);
    client = new Client({ name: 'test', version: '1.0.0' }, { capabilities: {} });
    await client.connect(clientTransport);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await client.close();
    await server.close();
  });

  it('boots and lists a healthy number of tools', async () => {
    const { tools } = await client.listTools();
    expect(tools.length).toBeGreaterThan(80);
  });

  it('derives a human title and completes read-tool annotations', async () => {
    const { tools } = await client.listTools();
    const resolve = tools.find((t) => t.name === 'resolve_asset');
    expect(resolve?.title).toBe('Resolve Asset');
    expect(resolve?.annotations?.readOnlyHint).toBe(true);
    expect(resolve?.annotations?.idempotentHint).toBe(true);
    expect(resolve?.annotations?.openWorldHint).toBe(true);
  });

  it('mirrors JSON text output as structuredContent', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        api_key: 'prism_sk_test',
        tier: 'agent',
        limits: { requests_per_minute: 5, requests_per_day: 100 },
        expires_at: '2026-03-04T00:00:00Z',
        message: 'ok',
      }),
    });
    const result: any = await client.callTool({ name: 'get_api_key', arguments: {} });
    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent.api_key).toBe('prism_sk_test');
  });

  it('exposes passive resources, including a live tool catalog', async () => {
    const { resources } = await client.listResources();
    const uris = resources.map((r) => r.uri);
    expect(uris).toContain('prism://capabilities');
    expect(uris).toContain('prism://asset-types');
    expect(uris).toContain('prism://tools');

    const catalog: any = await client.readResource({ uri: 'prism://tools' });
    const payload = JSON.parse(catalog.contents[0].text);
    expect(payload.count).toBeGreaterThan(80);
    expect(payload.tools[0]).toHaveProperty('title');
  });
});
