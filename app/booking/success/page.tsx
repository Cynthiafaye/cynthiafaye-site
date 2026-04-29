'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import SparkleField from '@/app/components/SparkleField';
import GlitterDots from '@/app/components/GlitterDots';

interface BookingDetails {
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
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function readingTypeName(id: string): string {
  const names: Record<string, string> = {
    diamond: 'Diamond Reading',
    signature: 'Signature Reading',
    crossover: 'Crossover Reading',
  };
  return names[id] || id;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId || !bookingId) {
      setError('Missing booking information');
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${sessionId}&booking_id=${bookingId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setBooking(data.booking);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to verify booking'))
      .finally(() => setLoading(false));
  }, [sessionId, bookingId]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 animate-pulse" />
        <p className="text-purple-400 font-body text-lg">Confirming your booking...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="card-glam rounded-2xl p-8">
          <div className="text-4xl mb-4">&#128542;</div>
          <h2 className="font-display text-2xl text-purple-900 mb-3">Something went wrong</h2>
          <p className="text-purple-600/70 font-body text-base mb-6">{error || 'Unable to verify your booking.'}</p>
          <Link href="/booking" className="btn-glam text-sm !py-2 !px-6 inline-block">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const isPhoneReading = booking.reading_format === 'phone';

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">&#10024;</div>
        <h2 className="font-display text-3xl md:text-4xl text-purple-900 mb-2">You&apos;re All Set!</h2>
        <p className="text-purple-600/70 font-body text-lg">Your reading with Cynthia is confirmed</p>
      </div>

      <div className="card-glam rounded-2xl p-8 mb-6">
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl text-purple-800 mb-1">{readingTypeName(booking.reading_type)}</h3>
          <p className="font-display text-3xl text-pink-600">${booking.total_price}</p>
        </div>

        <div className="divider-glam w-full mb-6" />

        <div className="space-y-3 text-base font-body">
          <div className="flex justify-between">
            <span className="text-purple-500">Date</span>
            <span className="text-purple-800 font-medium">{formatDate(booking.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Time</span>
            <span className="text-purple-800 font-medium">{formatTime(booking.start_time)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Format</span>
            <span className="text-purple-800 font-medium">{isPhoneReading ? 'Phone' : 'In Person'}</span>
          </div>
        </div>
      </div>

      {isPhoneReading ? (
        <div className="card-glam rounded-2xl p-8 mb-6 text-center border-2 border-pink-200">
          <div className="text-3xl mb-3">&#128222;</div>
          <p className="font-display text-xl text-purple-800 mb-2">
            Cynthia will call you for your reading at:
          </p>
          <p className="font-display text-2xl text-pink-600 mb-1">{booking.customer_phone}</p>
          <p className="font-display text-lg text-purple-700">
            at {formatTime(booking.start_time)} on {formatDate(booking.date)}
          </p>
        </div>
      ) : (
        <div className="card-glam rounded-2xl p-8 mb-6 text-center border-2 border-pink-200">
          <div className="text-3xl mb-3">&#128205;</div>
          <p className="font-display text-xl text-purple-800 mb-2">
            Your in-person reading is confirmed
          </p>
          <p className="text-purple-600/80 font-body text-base">
            Cynthia will send you the exact location details in Santa Rosa Beach before your appointment.
          </p>
          <p className="font-display text-lg text-purple-700 mt-3">
            {formatTime(booking.start_time)} on {formatDate(booking.date)}
          </p>
        </div>
      )}

      <div className="card-glam rounded-2xl p-6 mb-8 text-center bg-gradient-to-br from-purple-50/80 to-pink-50/80">
        <p className="font-script text-2xl text-pink-500 mb-2">A little tip from Cynthia...</p>
        <p className="text-purple-700/90 font-body text-lg leading-relaxed">
          Get comfortable and have a pen and paper ready to take notes if you&apos;d like.
          Your reading is a special time just for you &#10024;
        </p>
      </div>

      <div className="text-center">
        <Link href="/" className="btn-gold inline-block text-sm">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main>
      <NavBar isBookingPage />
      <section className="relative min-h-screen pt-28 pb-20 bg-glam-light overflow-hidden">
        <SparkleField count={25} />
        <GlitterDots count={18} />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Suspense fallback={
            <div className="text-center py-16">
              <p className="text-purple-400 font-body text-lg">Loading...</p>
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  );
}
