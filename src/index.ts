// Export the client
export { HessraClient } from './client.js';

// Export types
export type {
  HessraClientOptions,
  RequestTokenRequest,
  RequestTokenResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
  VerifyServiceChainTokenRequest,
  VerifyServiceChainTokenResponse,
  PublicKeyResponse,
} from './types/index.js';

// Export errors (not a type, so use standard export)
export { HessraApiError } from './types/index.js';
