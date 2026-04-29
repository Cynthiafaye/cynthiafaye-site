import { NextRequest, NextResponse } from 'next/server';
import { getBookingById } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get('booking_id');

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
  }

  try {
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking, paymentStatus: booking.status === 'confirmed' ? 'paid' : booking.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
