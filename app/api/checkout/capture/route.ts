import { NextRequest, NextResponse } from 'next/server';
import { paypalConfigured, capturePayPalOrder } from '@/app/lib/paypal';
import { updateBookingStatus } from '@/app/lib/db';
import { notifyNewBooking } from '@/app/lib/notifications';

export async function POST(request: NextRequest) {
  if (!paypalConfigured) {
    return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
  }

  const { orderId, bookingId, bookingDetails } = await request.json();

  if (!orderId || !bookingId) {
    return NextResponse.json({ error: 'Missing orderId or bookingId' }, { status: 400 });
  }

  try {
    const capture = await capturePayPalOrder(orderId);

    if (capture.status === 'COMPLETED') {
      await updateBookingStatus(bookingId, 'confirmed');

      if (bookingDetails) {
        await notifyNewBooking({
          customerName: bookingDetails.customerName,
          customerPhone: bookingDetails.customerPhone,
          customerEmail: bookingDetails.customerEmail,
          readingType: bookingDetails.readingType,
          readingFormat: bookingDetails.readingFormat,
          date: bookingDetails.date,
          startTime: bookingDetails.startTime,
          totalPrice: bookingDetails.totalPrice,
        });
      }

      return NextResponse.json({
        status: 'COMPLETED',
        bookingId,
      });
    }

    return NextResponse.json({
      error: 'Payment not completed',
      status: capture.status,
    }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Capture failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
