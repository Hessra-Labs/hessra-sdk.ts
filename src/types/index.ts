/**
 * Client configuration options
 */
export interface HessraClientOptions {
  /**
   * Base URL of the Hessra authorization service
   */
  baseUrl: string;
  /**
   * Client certificate file path for mTLS
   */
  certPath?: string;
  /**
   * Client private key file path for mTLS
   */
  keyPath?: string;
  /**
   * Client certificate data for mTLS (PEM format)
   */
  cert?: string;
  /**
   * Client private key data for mTLS (PEM format)
   */
  key?: string;
  /**
   * CA certificate file path for verifying the server (optional)
   */
  caCertPath?: string;
  /**
   * CA certificate data for verifying the server (optional, PEM format)
   */
  caCert?: string;
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * Request token request payload
 */
export interface RequestTokenRequest {
  /**
   * The name of the resource the requested token is for
   */
  resource: string;
}

/**
 * Request token response
 */
export interface RequestTokenResponse {
  /**
   * Response message
   */
  response_msg: string;
  /**
   * The issued token, or null if unauthorized
   */
  token: string | null;
}

/**
 * Verify token request payload
 */
export interface VerifyTokenRequest {
  /**
   * The token to be validated
   */
  token: string;
  /**
   * The subject identifier for the token validation
   */
  subject: string;
  /**
   * The resource the token is being validated for
   */
  resource: string;
}

/**
 * Verify token response
 */
export interface VerifyTokenResponse {
  /**
   * Response message
   */
  response_msg: string;
}

/**
 * Verify service chain token request payload
 */
export interface VerifyServiceChainTokenRequest {
  /**
   * The service chain token to be validated
   */
  token: string;
  /**
   * The subject identifier for the token validation
   */
  subject: string;
  /**
   * The service chain resource the token is being validated for
   */
  resource: string;
  /**
   * Optional component name to validate in the service chain
   */
  component?: string;
}

/**
 * Verify service chain token response
 */
export interface VerifyServiceChainTokenResponse {
  /**
   * Response message
   */
  response_msg: string;
}

/**
 * Public key response
 */
export interface PublicKeyResponse {
  /**
   * Response message
   */
  response_msg: string;
  /**
   * The public key in a serialized format
   */
  public_key: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  /**
   * Error message
   */
  message: string;
  /**
   * HTTP status code
   */
  status: number;
}

/**
 * Custom error class for API errors
 */
export class HessraApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HessraApiError';
    this.status = status;
  }
} 