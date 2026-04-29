'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import SparkleField from '@/app/components/SparkleField';
import GlitterDots from '@/app/components/GlitterDots';
import BookingWizard from '@/app/components/BookingWizard';

function BookingContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || undefined;
  const cancelled = searchParams.get('cancelled');

  return (
    <>
      {cancelled && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-pink-50 border border-pink-200 text-pink-700 px-5 py-4 rounded-2xl font-body text-base text-center">
            Your booking was cancelled. Feel free to try again whenever you&apos;re ready.
          </div>
        </div>
      )}
      <BookingWizard initialType={type} />
    </>
  );
}

export default function BookingPage() {
  return (
    <main>
      <NavBar isBookingPage />
      <section className="relative min-h-screen pt-28 pb-20 bg-glam-light overflow-hidden">
        <SparkleField count={20} />
        <GlitterDots count={15} />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-display text-sm tracking-[0.3em] uppercase text-pink-500 mb-3">&#10024; Book Online &#10024;</p>
            <h1 className="font-display text-4xl md:text-5xl text-purple-900 heading-decorated">
              Schedule Your Reading
            </h1>
            <p className="text-purple-700/70 font-body text-lg mt-4 max-w-xl mx-auto">
              Choose your reading, pick a time, and secure your spot with Cynthia.
            </p>
          </div>

          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-purple-400 font-body text-lg">Loading booking system...</p>
            </div>
          }>
            <BookingContent />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  );
}
