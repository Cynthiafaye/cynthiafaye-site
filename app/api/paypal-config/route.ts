import { NextResponse } from 'next/server';
import { paypalClientId } from '@/app/lib/paypal';

export async function GET() {
  if (!paypalClientId) {
    return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
  }
  return NextResponse.json({ clientId: paypalClientId });
}
