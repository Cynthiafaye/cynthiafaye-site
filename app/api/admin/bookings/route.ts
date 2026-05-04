import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings } from '@/app/lib/booking-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const bookings = await getAllBookings();
  return NextResponse.json({ bookings });
}
