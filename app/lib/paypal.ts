// eslint-disable-next-line @typescript-eslint/no-require-imports
const paypal = require('@paypal/checkout-server-sdk');

function sanitizeKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.replace(/[\s\r\n\t"']+/g, '').trim();
}

const clientId = sanitizeKey(process.env.PAYPAL_CLIENT_ID);
const clientSecret = sanitizeKey(process.env.PAYPAL_CLIENT_SECRET);
const isLive = process.env.PAYPAL_MODE === 'live';

function getClient() {
  if (!clientId || !clientSecret) return null;
  const environment = isLive
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(environment);
}

export const paypalClient = getClient();
export const paypalClientId = clientId || '';
export { paypal };
