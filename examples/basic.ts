import { HessraClient } from '../src';
// import { readFileSync } from 'fs'; // Unused since inlineCertsExample is commented out
import { join } from 'path';

// Load certificates from files
const certPath = join(__dirname, 'certs', 'client.crt');
const keyPath = join(__dirname, 'certs', 'client.key');

async function main() {
  try {
    // Initialize the client with certificate paths
    const client = new HessraClient({
      baseUrl: 'https://auth.example.com',
      certPath,
      keyPath,
      debug: true, // Enable debug logging
    });

    // Request a token
    console.log('Requesting token...');
    const tokenResponse = await client.requestToken({
      resource: 'resource1',
    });

    if (tokenResponse.token) {
      console.log('Token received:', tokenResponse.token);

      // Verify the token
      console.log('\nVerifying token...');
      const verifyResponse = await client.verifyToken({
        token: tokenResponse.token,
        subject: 'uri:urn:test:client',
        resource: 'resource1',
      });

      console.log('Verification result:', verifyResponse.response_msg);
    } else {
      console.log('Failed to get token:', tokenResponse.response_msg);
    }

    // Get the public key (doesn't require mTLS)
    console.log('\nGetting public key...');
    const publicKeyResponse = await client.getPublicKey();
    console.log('Public key:', publicKeyResponse.public_key);
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

// Run the example
main();

/* Example with inline certificates - currently unused
async function inlineCertsExample() {
  try {
    // Load certificate data from files
    const cert = readFileSync(certPath, 'utf8');
    const key = readFileSync(keyPath, 'utf8');
    
    // Initialize the client with certificate data
    const client = new HessraClient({
      baseUrl: 'https://auth.example.com',
      cert,
      key,
    });
    
    // Request a token
    const tokenResponse = await client.requestToken({
      resource: 'resource1',
    });
    
    console.log('Token:', tokenResponse.token);
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}
*/

// Run the inline certificates example
// inlineCertsExample();
