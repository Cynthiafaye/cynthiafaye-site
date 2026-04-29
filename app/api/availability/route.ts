import { NextRequest, NextResponse } from 'next/server';
import { getAvailableTimesForDate } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }

  const availableTimes = await getAvailableTimesForDate(date);
  return NextResponse.json({ availableTimes });
}
