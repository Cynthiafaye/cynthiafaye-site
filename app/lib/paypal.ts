function sanitizeKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.replace(/[\s\r\n\t"']+/g, '').trim();
}

const clientId = sanitizeKey(process.env.PAYPAL_CLIENT_ID);
const clientSecret = sanitizeKey(process.env.PAYPAL_CLIENT_SECRET);
const isLive = process.env.PAYPAL_MODE === 'live';

const baseURL = isLive
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export const paypalClientId = clientId || '';
export const paypalConfigured = !!(clientId && clientSecret);

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(params: {
  referenceId: string;
  description: string;
  amount: string;
}): Promise<{ id: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${baseURL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: params.referenceId,
        description: params.description,
        amount: {
          currency_code: 'USD',
          value: params.amount,
        },
      }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal order creation failed: ${text}`);
  }
  return res.json();
}

export async function capturePayPalOrder(orderId: string): Promise<{ status: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${baseURL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture failed: ${text}`);
  }
  return res.json();
}
