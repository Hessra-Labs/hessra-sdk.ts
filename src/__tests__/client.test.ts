import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HessraClient } from '../client';
import { HessraClientOptions } from '../types';
import * as https from '../utils/https.js';
import { Agent } from 'https';

// Mock modules before importing them
// We need to mock node-fetch using vi.mock
vi.mock('node-fetch', () => ({
  default: vi.fn(),
}));

describe('HessraClient', () => {
  let client: HessraClient;
  let nodeFetch: ReturnType<typeof vi.fn>;

  // Prepare default options for the client
  const defaultOptions: HessraClientOptions = {
    baseUrl: 'https://auth.example.com',
    cert: '-----BEGIN CERTIFICATE-----\nMOCKED_CERT\n-----END CERTIFICATE-----',
    key: '-----BEGIN PRIVATE KEY-----\nMOCKED_KEY\n-----END PRIVATE KEY-----',
  };

  beforeEach(async () => {
    // Reset all mocks
    vi.resetAllMocks();

    // Set up mocks for the https utilities
    vi.spyOn(https, 'createHttpsAgent').mockReturnValue(new Agent() as Agent);
    vi.spyOn(https, 'buildUrl').mockImplementation((base, path) => `${base}${path}`);

    // Get a reference to the mocked fetch
    nodeFetch = (await import('node-fetch')).default as unknown as ReturnType<typeof vi.fn>;

    // Create a client instance
    client = new HessraClient(defaultOptions);
  });

  describe('requestToken', () => {
    it('should make a POST request to /request_token', async () => {
      // Setup mock response
      const mockResponse = {
        ok: true,
        status: 201,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({
          response_msg: 'Token issued',
          token: 'mocked-token-value',
        }),
      };

      // Set up mock to return our response
      nodeFetch.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await client.requestToken({ resource: 'resource1' });

      // Verify the function was called with the correct arguments
      expect(nodeFetch).toHaveBeenCalledTimes(1);

      // Check that the URL and method are correct
      expect(https.buildUrl).toHaveBeenCalledWith('https://auth.example.com', '/request_token');

      // Check the request options
      const callOptions = nodeFetch.mock.calls[0][1];
      expect(callOptions).toMatchObject({
        method: 'POST',
        body: JSON.stringify({ resource: 'resource1' }),
      });

      // Verify the result
      expect(result).toEqual({
        response_msg: 'Token issued',
        token: 'mocked-token-value',
      });
    });
  });

  describe('verifyToken', () => {
    it('should make a POST request to /verify_token', async () => {
      // Setup mock response
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({
          response_msg: 'Token validated',
        }),
      };

      // Set up mock to return our response
      nodeFetch.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await client.verifyToken({
        token: 'test-token',
        subject: 'uri:urn:test:client',
        resource: 'resource1',
      });

      // Verify the function was called with the correct arguments
      expect(nodeFetch).toHaveBeenCalledTimes(1);

      // Check that the URL and method are correct
      expect(https.buildUrl).toHaveBeenCalledWith('https://auth.example.com', '/verify_token');

      // Check the request options
      const callOptions = nodeFetch.mock.calls[0][1];
      expect(callOptions).toMatchObject({
        method: 'POST',
        body: JSON.stringify({
          token: 'test-token',
          subject: 'uri:urn:test:client',
          resource: 'resource1',
        }),
      });

      // Verify the result
      expect(result).toEqual({
        response_msg: 'Token validated',
      });
    });
  });
});
