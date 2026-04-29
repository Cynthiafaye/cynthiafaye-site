import { supabase } from './supabase';
import { OPERATING_HOURS, SLOT_DURATION } from './constants';

export interface Booking {
  id: string;
  reading_type: string;
  reading_format: string;
  date: string;
  start_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total_price: number;
  status: string;
  stripe_session_id?: string;
  created_at?: string;
}

const inMemoryBookings: Booking[] = [];

function generateId(): string {
  return `bk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function generateAllSlots(): string[] {
  const slots: string[] = [];
  for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < OPERATING_HOURS.end || SLOT_DURATION < 60) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    return (h * 60 + m + SLOT_DURATION) <= OPERATING_HOURS.end * 60;
  });
}

async function cleanStalePending() {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  if (supabase) {
    await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('status', 'pending')
      .lt('created_at', thirtyMinAgo);
  } else {
    inMemoryBookings.forEach(b => {
      if (b.status === 'pending' && b.created_at && b.created_at < thirtyMinAgo) {
        b.status = 'cancelled';
      }
    });
  }
}

export async function getAvailableTimesForDate(date: string): Promise<string[]> {
  await cleanStalePending();

  const allSlots = generateAllSlots();
  let bookedTimes: string[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('bookings')
      .select('start_time')
      .eq('date', date)
      .in('status', ['confirmed', 'pending']);
    bookedTimes = (data || []).map(b => b.start_time);
  } else {
    bookedTimes = inMemoryBookings
      .filter(b => b.date === date && ['confirmed', 'pending'].includes(b.status))
      .map(b => b.start_time);
  }

  return allSlots.filter(slot => !bookedTimes.includes(slot));
}

export async function isTimeSlotAvailable(date: string, startTime: string): Promise<boolean> {
  const available = await getAvailableTimesForDate(date);
  return available.includes(startTime);
}

export async function createBooking(data: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
  const booking: Booking = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('bookings').insert(booking);
    if (error) throw new Error(`Failed to create booking: ${error.message}`);
  } else {
    inMemoryBookings.push(booking);
  }

  return booking;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (supabase) {
    const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
    return data;
  }
  return inMemoryBookings.find(b => b.id === id) || null;
}

export async function updateBookingStatus(id: string, status: string) {
  if (supabase) {
    await supabase.from('bookings').update({ status }).eq('id', id);
  } else {
    const booking = inMemoryBookings.find(b => b.id === id);
    if (booking) booking.status = status;
  }
}

export async function updateBookingStripeSession(id: string, sessionId: string) {
  if (supabase) {
    await supabase.from('bookings').update({ stripe_session_id: sessionId }).eq('id', id);
  } else {
    const booking = inMemoryBookings.find(b => b.id === id);
    if (booking) booking.stripe_session_id = sessionId;
  }
}
