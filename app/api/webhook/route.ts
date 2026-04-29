import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    if (eventType === 'CHECKOUT.ORDER.APPROVED') {
      const referenceId = body.resource?.purchase_units?.[0]?.reference_id;
      if (referenceId) {
        await updateBookingStatus(referenceId, 'confirmed');
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.DENIED' || eventType === 'PAYMENT.CAPTURE.REVERSED') {
      const referenceId = body.resource?.purchase_units?.[0]?.reference_id;
      if (referenceId) {
        await updateBookingStatus(referenceId, 'cancelled');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
