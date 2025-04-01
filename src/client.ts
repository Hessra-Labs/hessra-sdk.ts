import nodeFetch from 'node-fetch';
import { Agent } from 'https';
import { createHttpsAgent, buildUrl } from './utils/https.js';
import {
  HessraClientOptions,
  RequestTokenRequest,
  RequestTokenResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
  VerifyServiceChainTokenRequest,
  VerifyServiceChainTokenResponse,
  PublicKeyResponse,
  HessraApiError,
} from './types/index.js';

/**
 * HessraClient - A TypeScript client for the Hessra Authorization Service
 */
export class HessraClient {
  private baseUrl: string;
  private httpsAgent?: Agent;
  private timeout: number;
  private debug: boolean;

  /**
   * Creates a new HessraClient instance
   * @param options Client configuration options
   */
  constructor(options: HessraClientOptions) {
    this.baseUrl = options.baseUrl;
    this.timeout = options.timeout || 30000; // Default timeout of 30 seconds
    this.debug = options.debug || false;

    // Only create HTTPS agent if we have certificate info - not needed for /public_key
    if (options.cert || options.certPath) {
      this.httpsAgent = createHttpsAgent(options);
    }
  }

  /**
   * Makes an HTTP request to the API
   * @param method HTTP method
   * @param path API path
   * @param data Request body data
   * @param requiresMtls Whether the endpoint requires mTLS
   * @returns Response data
   */
  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    data?: unknown,
    requiresMtls = true
  ): Promise<T> {
    const url = buildUrl(this.baseUrl, path);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const options: Record<string, unknown> = {
      method,
      headers,
      // Only add the HTTPS agent for mTLS endpoints if we have one
      ...(requiresMtls && this.httpsAgent ? { agent: this.httpsAgent } : {}),
      // Add timeout
      timeout: this.timeout,
    };

    // Add request body for POST requests
    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }

    if (this.debug) {
      console.log(`[HessraClient] ${method} ${url}`);
      if (data) {
        console.log(`[HessraClient] Request body:`, JSON.stringify(data, null, 2));
      }
    }

    try {
      const response = await nodeFetch(url, options);

      // Parse response body
      let responseBody: unknown;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      if (this.debug) {
        console.log(`[HessraClient] Response status: ${response.status}`);
        console.log(`[HessraClient] Response body:`, responseBody);
      }

      // Handle non-200 responses
      if (!response.ok) {
        throw new HessraApiError(
          typeof responseBody === 'string'
            ? responseBody
            : (responseBody as Record<string, string>).response_msg || 'Unknown error',
          response.status
        );
      }

      return responseBody as T;
    } catch (error) {
      if (error instanceof HessraApiError) {
        throw error;
      }

      // Wrap other errors
      const message = (error as Error).message || 'Unknown error';
      if (this.debug) {
        console.error(`[HessraClient] Request error:`, error);
      }
      throw new HessraApiError(message, 500);
    }
  }

  /**
   * Request a token for access to a resource.
   * @param payload Request payload
   * @returns Token response
   */
  public async requestToken(payload: RequestTokenRequest): Promise<RequestTokenResponse> {
    return this.request<RequestTokenResponse>('POST', '/request_token', payload);
  }

  /**
   * Validates a JWT for a requestor.
   * @param payload Request payload
   * @returns Validation response
   */
  public async verifyToken(payload: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    return this.request<VerifyTokenResponse>('POST', '/verify_token', payload);
  }

  /**
   * Validates a service chain token for a requestor.
   * @param payload Request payload
   * @returns Validation response
   */
  public async verifyServiceChainToken(
    payload: VerifyServiceChainTokenRequest
  ): Promise<VerifyServiceChainTokenResponse> {
    return this.request<VerifyServiceChainTokenResponse>(
      'POST',
      '/verify_service_chain_token',
      payload
    );
  }

  /**
   * Retrieve the server's public key.
   * @returns Public key response
   */
  public async getPublicKey(): Promise<PublicKeyResponse> {
    // This endpoint doesn't require mTLS
    return this.request<PublicKeyResponse>('GET', '/public_key', undefined, false);
  }
}
