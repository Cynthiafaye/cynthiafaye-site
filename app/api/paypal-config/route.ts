import { NextResponse } from 'next/server';
import { paypalClientId } from '@/app/lib/paypal';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!paypalClientId) {
    return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
  }
  const secret = process.env.PAYPAL_CLIENT_SECRET || '';
  const mode = process.env.PAYPAL_MODE || '';
  return NextResponse.json({
    clientId: paypalClientId,
    secretLength: secret.length,
    secretStart: secret.substring(0, 4),
    secretEnd: secret.substring(secret.length - 4),
    mode,
  });
}
