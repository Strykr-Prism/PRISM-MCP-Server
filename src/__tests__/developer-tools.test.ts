/**
 * Tests for OpenClaw-first MCP developer tools.
 * 
 * Tests:
 * - get_api_key tool
 * - check_usage tool
 * - check_tiers tool
 * - verify_key tool
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDeveloperTools } from '../tools/developer';

// Mock the prism client
vi.mock('../client.js', () => ({
  prism: {
    developer: {
      getUsageStats: vi.fn(),
      getTiers: vi.fn(),
      verifyKey: vi.fn(),
      getHealth: vi.fn()
    }
  }
}));

// Mock fetch for get_api_key
global.fetch = vi.fn();

describe('MCP Developer Tools', () => {
  let server: McpServer;

  beforeEach(() => {
    server = new McpServer({
      name: 'test-prism-mcp',
      version: '1.0.0'
    });
    registerDeveloperTools(server);
    vi.clearAllMocks();
  });

  describe('get_api_key tool', () => {
    it('should fetch an instant API key from the public endpoint', async () => {
      const mockResponse = {
        api_key: 'prism_sk_test_instant_mcp_123',
        tier: 'agent',
        limits: {
          requests_per_minute: 5,
          requests_per_day: 100
        },
        expires_at: '2026-03-04T00:00:00Z',
        message: 'Free instant API key created (7-day expiry)'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const tools = await server.listTools();
      const getApiKeyTool = tools.find(t => t.name === 'get_api_key');
      
      expect(getApiKeyTool).toBeDefined();
      expect(getApiKeyTool?.description).toContain('instant');
      expect(getApiKeyTool?.description).toContain('no signup');

      // Execute the tool
      const result = await server.callTool('get_api_key', {});
      
      expect(result.content[0].type).toBe('text');
      const content = JSON.parse((result.content[0] as any).text);
      
      expect(content.api_key).toBe('prism_sk_test_instant_mcp_123');
      expect(content.tier).toBe('agent');
      expect(content._hint).toContain('Store this key securely');
      
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.prismapi.ai/auth/keys/instant'
      );
    });

    it('should handle API failures gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(
        server.callTool('get_api_key', {})
      ).rejects.toThrow('Failed to get instant key');
    });

    it('should be marked as non-read-only', async () => {
      const tools = await server.listTools();
      const getApiKeyTool = tools.find(t => t.name === 'get_api_key');
      
      expect(getApiKeyTool?.annotations?.readOnlyHint).toBe(false);
    });
  });

  describe('check_usage tool', () => {
    it('should return usage stats for the configured API key', async () => {
      const mockUsageStats = {
        key_id: 'key_123',
        tier: 'dev',
        usage_count_total: 1500,
        usage_count_today: 42,
        requests_per_minute_limit: 100,
        requests_per_day_limit: 100000,
        last_used_at: '2026-02-24T10:30:00Z',
        created_at: '2026-01-01T00:00:00Z'
      };

      const { prism } = await import('../client.js');
      (prism.developer.getUsageStats as any).mockResolvedValueOnce(mockUsageStats);

      const result = await server.callTool('check_usage', {});
      
      expect(result.content[0].type).toBe('text');
      const content = JSON.parse((result.content[0] as any).text);
      
      expect(content.tier).toBe('dev');
      expect(content.usage_count_today).toBe(42);
      expect(content.requests_per_minute_limit).toBe(100);
    });

    it('should be marked as read-only', async () => {
      const tools = await server.listTools();
      const checkUsageTool = tools.find(t => t.name === 'check_usage');
      
      expect(checkUsageTool?.annotations?.readOnlyHint).toBe(true);
    });
  });

  describe('check_tiers tool', () => {
    it('should list all available API tiers', async () => {
      const mockTiers = {
        tiers: {
          free: { requests_per_minute: 1, requests_per_day: 1000 },
          agent: { requests_per_minute: 5, requests_per_day: 100 },
          dev: { requests_per_minute: 100, requests_per_day: 100000 },
          pro: { requests_per_minute: 300, requests_per_day: 1000000 },
          enterprise: 'custom'
        },
        default_tier: 'free',
        anonymous_tier: 'anonymous'
      };

      const { prism } = await import('../client.js');
      (prism.developer.getTiers as any).mockResolvedValueOnce(mockTiers);

      const result = await server.callTool('check_tiers', {});
      
      expect(result.content[0].type).toBe('text');
      const content = JSON.parse((result.content[0] as any).text);
      
      expect(content.tiers.agent).toBeDefined();
      expect(content.tiers.dev).toBeDefined();
      expect(content.tiers.pro).toBeDefined();
    });

    it('should be marked as read-only', async () => {
      const tools = await server.listTools();
      const checkTiersTool = tools.find(t => t.name === 'check_tiers');
      
      expect(checkTiersTool?.annotations?.readOnlyHint).toBe(true);
    });
  });

  describe('verify_key tool', () => {
    it('should verify a valid API key', async () => {
      const mockVerification = {
        valid: true,
        key_id: 'key_456',
        tier: 'pro',
        expires_at: '2027-01-01T00:00:00Z',
        message: 'API key is valid'
      };

      const { prism } = await import('../client.js');
      (prism.developer.verifyKey as any).mockResolvedValueOnce(mockVerification);

      const result = await server.callTool('verify_key', {
        key: 'prism_sk_test_verify_123'
      });
      
      expect(result.content[0].type).toBe('text');
      const content = JSON.parse((result.content[0] as any).text);
      
      expect(content.valid).toBe(true);
      expect(content.tier).toBe('pro');
    });

    it('should handle invalid keys', async () => {
      const mockVerification = {
        valid: false,
        message: 'API key is invalid or expired'
      };

      const { prism } = await import('../client.js');
      (prism.developer.verifyKey as any).mockResolvedValueOnce(mockVerification);

      const result = await server.callTool('verify_key', {
        key: 'prism_sk_invalid'
      });
      
      const content = JSON.parse((result.content[0] as any).text);
      expect(content.valid).toBe(false);
    });

    it('should require key parameter', async () => {
      const tools = await server.listTools();
      const verifyKeyTool = tools.find(t => t.name === 'verify_key');
      
      expect(verifyKeyTool?.inputSchema).toBeDefined();
      expect((verifyKeyTool?.inputSchema as any).required).toContain('key');
    });

    it('should be marked as read-only', async () => {
      const tools = await server.listTools();
      const verifyKeyTool = tools.find(t => t.name === 'verify_key');
      
      expect(verifyKeyTool?.annotations?.readOnlyHint).toBe(true);
    });
  });

  describe('Tool registration', () => {
    it('should register all 4 new developer tools', async () => {
      const tools = await server.listTools();
      const developerTools = tools.filter(t => 
        ['get_api_key', 'check_usage', 'check_tiers', 'verify_key'].includes(t.name)
      );
      
      expect(developerTools).toHaveLength(4);
    });

    it('should still have api_health tool', async () => {
      const tools = await server.listTools();
      const healthTool = tools.find(t => t.name === 'api_health');
      
      expect(healthTool).toBeDefined();
    });
  });

  describe('Integration: Agent workflow', () => {
    it('should support complete agent onboarding flow', async () => {
      // Step 1: Get instant key
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          api_key: 'prism_sk_agent_workflow_123',
          tier: 'agent',
          limits: { requests_per_minute: 5, requests_per_day: 100 },
          expires_at: '2026-03-04T00:00:00Z',
          message: 'Free instant API key created'
        })
      });

      const keyResult = await server.callTool('get_api_key', {});
      const keyData = JSON.parse((keyResult.content[0] as any).text);
      
      expect(keyData.api_key).toBe('prism_sk_agent_workflow_123');

      // Step 2: Verify the key
      const { prism } = await import('../client.js');
      (prism.developer.verifyKey as any).mockResolvedValueOnce({
        valid: true,
        tier: 'agent'
      });

      const verifyResult = await server.callTool('verify_key', {
        key: keyData.api_key
      });
      const verifyData = JSON.parse((verifyResult.content[0] as any).text);
      
      expect(verifyData.valid).toBe(true);

      // Step 3: Check available tiers
      (prism.developer.getTiers as any).mockResolvedValueOnce({
        tiers: {
          agent: { requests_per_minute: 5 },
          dev: { requests_per_minute: 100 }
        }
      });

      const tiersResult = await server.callTool('check_tiers', {});
      const tiersData = JSON.parse((tiersResult.content[0] as any).text);
      
      expect(tiersData.tiers.dev).toBeDefined();
    });
  });
});
