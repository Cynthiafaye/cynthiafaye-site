import { NextRequest, NextResponse } from 'next/server';
import { paypalClient, paypal } from '@/app/lib/paypal';
import { createBooking, isTimeSlotAvailable } from '@/app/lib/db';
import { READING_TYPES } from '@/app/lib/constants';

export async function POST(request: NextRequest) {
  if (!paypalClient) {
    return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { readingType, readingFormat, date, startTime, customerName, customerPhone, customerEmail } = body;

  if (!readingType || !readingFormat || !date || !startTime || !customerName || !customerPhone || !customerEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const reading = READING_TYPES.find(r => r.id === readingType);
  if (!reading) {
    return NextResponse.json({ error: 'Invalid reading type' }, { status: 400 });
  }

  const available = await isTimeSlotAvailable(date, startTime);
  if (!available) {
    return NextResponse.json({ error: 'This time slot is no longer available' }, { status: 409 });
  }

  const booking = await createBooking({
    reading_type: readingType,
    reading_format: readingFormat,
    date,
    start_time: startTime,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    total_price: reading.price,
    status: 'pending',
  });

  try {
    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer('return=representation');
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: booking.id,
        description: `${reading.name} with Cynthia Faye on ${date} at ${formatTime(startTime)}`,
        amount: {
          currency_code: 'USD',
          value: reading.price.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'Cynthia Faye - The Gift',
        user_action: 'PAY_NOW',
      },
    });

    const order = await paypalClient.execute(orderRequest);

    return NextResponse.json({
      orderId: order.result.id,
      bookingId: booking.id,
    });
  } catch (error) {
    const { updateBookingStatus } = await import('@/app/lib/db');
    await updateBookingStatus(booking.id, 'cancelled');
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}
