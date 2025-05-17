// This is a mock Next.js API route handler to demonstrate using the SDK in Next.js
// In a real application, this would be in a file like 'pages/api/auth/token.ts'

import type { NextApiRequest, NextApiResponse } from 'next';
import { HessraClient } from '../src';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Type for the response data
type ResponseData = {
  token?: string;
  error?: string;
};

/**
 * API handler for requesting a token from the Hessra Authorization Service
 *
 * Expects:
 * - POST request
 * - JSON body with { resource: string, operation: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract resource from request body
    const { resource, operation } = req.body;

    if (!resource || typeof resource !== 'string') {
      return res.status(400).json({ error: 'Resource is required and must be a string' });
    }

    if (!operation || typeof operation !== 'string') {
      return res.status(400).json({ error: 'Operation is required and must be a string' });
    }

    // Option 1: Load certificates from environment variables
    let cert = process.env.HESSRA_CLIENT_CERT;
    let key = process.env.HESSRA_CLIENT_KEY;
    let baseUrl = process.env.HESSRA_SERVICE_URL;
    let ca = process.env.HESSRA_CA_CERT;

    // Option 2: Load certificates from files (as in basic example)
    if (!cert || !key || !baseUrl) {
      // Get the directory path in CommonJS environment
      const __dirname = process.cwd();

      // Define certificate paths
      const certPath = join(__dirname, 'certs', 'client.crt');
      const keyPath = join(__dirname, 'certs', 'client.key');
      const caPath = join(__dirname, 'certs', 'ca-2030.pem');
      baseUrl = 'https://test.hessra.net'; // Default URL if not in env

      // Initialize the Hessra client with file paths
      const client = new HessraClient({
        baseUrl,
        certPath,
        keyPath,
        caCertPath: caPath,
      });

      // Request a token from the Hessra service
      const response = await client.requestToken({ resource, operation });

      if (response.token) {
        // Return the token to the client
        return res.status(200).json({ token: response.token });
      } else {
        // Resource not authorized
        return res.status(403).json({ error: response.response_msg });
      }
    } else {
      // Initialize the Hessra client with env vars
      const client = new HessraClient({
        baseUrl,
        cert,
        key,
        caCert: ca,
      });

      // Request a token from the Hessra service
      const response = await client.requestToken({ resource, operation });

      if (response.token) {
        // Return the token to the client
        return res.status(200).json({ token: response.token });
      } else {
        // Resource not authorized
        return res.status(403).json({ error: response.response_msg });
      }
    }
  } catch (error) {
    console.error('Error requesting token:', error);
    return res.status(500).json({ error: 'Failed to request token' });
  }
}
