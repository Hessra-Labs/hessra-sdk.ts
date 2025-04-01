// This is a mock Next.js API route handler to demonstrate using the SDK in Next.js
// In a real application, this would be in a file like 'pages/api/auth/token.ts'

import type { NextApiRequest, NextApiResponse } from 'next';
import { HessraClient } from '../../src';

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
 * - JSON body with { resource: string }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract resource from request body
    const { resource } = req.body;
    
    if (!resource || typeof resource !== 'string') {
      return res.status(400).json({ error: 'Resource is required and must be a string' });
    }
    
    // In a real application, you would load these from a secure source
    // like environment variables or a secret manager
    const cert = process.env.HESSRA_CLIENT_CERT;
    const key = process.env.HESSRA_CLIENT_KEY;
    const baseUrl = process.env.HESSRA_SERVICE_URL;
    
    if (!cert || !key || !baseUrl) {
      console.error('Missing required environment variables for mTLS connection');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Initialize the Hessra client
    const client = new HessraClient({
      baseUrl,
      cert,
      key,
    });
    
    // Request a token from the Hessra service
    const response = await client.requestToken({ resource });
    
    if (response.token) {
      // Return the token to the client
      return res.status(200).json({ token: response.token });
    } else {
      // Resource not authorized
      return res.status(403).json({ error: response.response_msg });
    }
  } catch (error) {
    console.error('Error requesting token:', error);
    return res.status(500).json({ error: 'Failed to request token' });
  }
} 