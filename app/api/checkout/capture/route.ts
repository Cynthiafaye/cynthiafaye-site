import { NextRequest, NextResponse } from 'next/server';
import { paypalConfigured, capturePayPalOrder } from '@/app/lib/paypal';
import { getBookingById, updateBookingStatus } from '@/app/lib/db';
import { notifyNewBooking } from '@/app/lib/notifications';

export async function POST(request: NextRequest) {
  if (!paypalConfigured) {
    return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
  }

  const { orderId, bookingId } = await request.json();

  if (!orderId || !bookingId) {
    return NextResponse.json({ error: 'Missing orderId or bookingId' }, { status: 400 });
  }

  try {
    const capture = await capturePayPalOrder(orderId);

    if (capture.status === 'COMPLETED') {
      await updateBookingStatus(bookingId, 'confirmed');

      const booking = await getBookingById(bookingId);
      if (booking) {
        notifyNewBooking({
          customerName: booking.customer_name,
          customerPhone: booking.customer_phone,
          customerEmail: booking.customer_email,
          readingType: booking.reading_type,
          readingFormat: booking.reading_format,
          date: booking.date,
          startTime: booking.start_time,
          totalPrice: booking.total_price,
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
