# Hessra SDK for TypeScript

A TypeScript client for the Hessra Authorization Service, designed for server-side environments like Next.js (Vercel) and Deno (Supabase).

## Features

- Full TypeScript support with proper type definitions
- Mutual TLS (mTLS) authentication
- Support for all Hessra Authorization API endpoints
- Server-side compatibility (Node.js, Next.js API routes, Edge functions)
- Minimal dependencies

## Installation

```sh
npm install hessra-sdk
# or
yarn add hessra-sdk
# or
pnpm add hessra-sdk
```

## Usage

### Basic Setup

```typescript
import { HessraClient } from 'hessra-sdk';

// Initialize with certificates for mTLS
const client = new HessraClient({
  baseUrl: 'https://auth.example.com',
  certPath: '/path/to/client.crt',
  keyPath: '/path/to/client.key',
  caCertPath: '/path/to/ca.crt', // Optional
});

// Or with certificate data directly
const clientWithCertData = new HessraClient({
  baseUrl: 'https://auth.example.com',
  cert: '-----BEGIN CERTIFICATE-----\n...',
  key: '-----BEGIN PRIVATE KEY-----\n...',
  caCert: '-----BEGIN CERTIFICATE-----\n...', // Optional
});
```

### Request a Token

```typescript
const tokenResponse = await client.requestToken({ resource: 'resource1' });
console.log(tokenResponse.token);
```

### Verify a Token

```typescript
const verifyResponse = await client.verifyToken({
  token: 'your-jwt-token',
  subject: 'uri:urn:test:client',
  resource: 'resource1',
});

if (verifyResponse.response_msg === 'Token validated') {
  console.log('Token is valid');
}
```

### Verify a Service Chain Token

```typescript
const verifyServiceChainResponse = await client.verifyServiceChainToken({
  token: 'your-service-chain-token',
  subject: 'uri:urn:test:client',
  resource: 'resource4',
  component: 'edge_function', // Optional
});

if (verifyServiceChainResponse.response_msg === 'Service chain token validated') {
  console.log('Service chain token is valid');
}
```

### Get Public Key

```typescript
const publicKeyResponse = await client.getPublicKey();
console.log(publicKeyResponse.public_key);
```

## Next.js API Route Example

```typescript
// pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { HessraClient } from 'hessra-sdk';

// Load certificates from environment variables or secure storage
const cert = process.env.CLIENT_CERT;
const key = process.env.CLIENT_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!cert || !key) {
    return res.status(500).json({ error: 'Missing certificates' });
  }

  const client = new HessraClient({
    baseUrl: process.env.AUTH_SERVICE_URL || 'https://auth.example.com',
    cert,
    key,
  });

  try {
    const tokenResponse = await client.requestToken({ resource: req.body.resource });
    res.status(200).json({ token: tokenResponse.token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
```

## Development

```sh
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build
```

## License

ISC