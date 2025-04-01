import { readFileSync } from 'fs';
import { Agent } from 'https';
import { HessraClientOptions } from '../types/index.js';

/**
 * Creates an HTTPS agent configured for mTLS
 * @param options Client options
 * @returns Configured HTTPS agent
 */
export function createHttpsAgent(options: HessraClientOptions): Agent {
  // Prepare TLS options for the HTTPS agent
  const agentOptions: Record<string, any> = {
    rejectUnauthorized: true, // Always validate server certificates
  };

  // Load client certificate and key from file or use directly provided strings
  if (options.certPath) {
    try {
      agentOptions.cert = readFileSync(options.certPath);
    } catch (err) {
      throw new Error(
        `Failed to read client certificate from ${options.certPath}: ${(err as Error).message}`
      );
    }
  } else if (options.cert) {
    agentOptions.cert = options.cert;
  } else {
    throw new Error('Client certificate is required for mTLS. Provide either certPath or cert.');
  }

  if (options.keyPath) {
    try {
      agentOptions.key = readFileSync(options.keyPath);
    } catch (err) {
      throw new Error(
        `Failed to read client key from ${options.keyPath}: ${(err as Error).message}`
      );
    }
  } else if (options.key) {
    agentOptions.key = options.key;
  } else {
    throw new Error('Client key is required for mTLS. Provide either keyPath or key.');
  }

  // Load CA certificate if provided (optional)
  if (options.caCertPath) {
    try {
      agentOptions.ca = readFileSync(options.caCertPath);
    } catch (err) {
      throw new Error(
        `Failed to read CA certificate from ${options.caCertPath}: ${(err as Error).message}`
      );
    }
  } else if (options.caCert) {
    agentOptions.ca = options.caCert;
  }

  return new Agent(agentOptions);
}

/**
 * Removes leading/trailing slashes from URL path
 * @param path URL path segment
 * @returns Normalized path
 */
export function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

/**
 * Builds a complete URL from base URL and path
 * @param baseUrl Base URL
 * @param path Path to append
 * @returns Complete URL
 */
export function buildUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
