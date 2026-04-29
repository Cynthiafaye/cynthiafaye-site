import Stripe from 'stripe';

function sanitizeKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.replace(/[\s\r\n\t"']+/g, '').trim();
}

const stripeSecretKey = sanitizeKey(process.env.STRIPE_SECRET_KEY);

export const stripe = stripeSecretKey
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? new Stripe(stripeSecretKey, { apiVersion: '2026-04-22.dahlia' as any })
  : null;
