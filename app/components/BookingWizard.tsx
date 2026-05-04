'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfDay, getDay } from 'date-fns';
import { READING_TYPES, READING_FORMATS, ReadingTypeId, ReadingFormatId } from '@/app/lib/constants';

interface BookingData {
  readingType: ReadingTypeId | null;
  readingFormat: ReadingFormatId | null;
  date: string | null;
  startTime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return format(date, 'EEEE, MMMM d, yyyy');
}

export default function BookingWizard({ initialType }: { initialType?: string }) {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingData>({
    readingType: (READING_TYPES.find(r => r.id === initialType)?.id as ReadingTypeId) || null,
    readingFormat: null,
    date: null,
    startTime: null,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialType && READING_TYPES.find(r => r.id === initialType)) {
      setStep(2);
    }
  }, [initialType]);

  const selectedReading = READING_TYPES.find(r => r.id === booking.readingType);

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator current={step} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-body text-base">
          {error}
        </div>
      )}

      {step === 1 && (
        <StepReadingType
          selected={booking.readingType}
          onSelect={(type) => {
            setBooking(b => ({ ...b, readingType: type }));
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepFormat
          selected={booking.readingFormat}
          onSelect={(fmt) => {
            setBooking(b => ({ ...b, readingFormat: fmt }));
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepDateTime
          selectedDate={booking.date}
          selectedTime={booking.startTime}
          onSelect={(date, time) => {
            setBooking(b => ({ ...b, date, startTime: time }));
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <StepCustomerInfo
          booking={booking}
          onChange={(field, value) => setBooking(b => ({ ...b, [field]: value }))}
          onSubmit={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && selectedReading && (
        <StepReview
          booking={booking}
          reading={selectedReading}
          onError={(msg) => setError(msg)}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ['Reading', 'Format', 'Date & Time', 'Your Info', 'Review'];
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display transition-all ${
              active ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-300/30' :
              done ? 'bg-pink-100 text-pink-600' : 'bg-purple-50 text-purple-300'
            }`}>
              {done ? '✓' : num}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-0.5 ${done ? 'bg-pink-300' : 'bg-purple-100'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepReadingType({ selected, onSelect }: { selected: ReadingTypeId | null; onSelect: (type: ReadingTypeId) => void }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-purple-900 text-center mb-2">Choose Your Reading</h2>
      <p className="text-purple-600/70 font-body text-center mb-8">Select the type of reading that speaks to you</p>
      <div className="space-y-4">
        {READING_TYPES.map((reading) => (
          <button
            key={reading.id}
            onClick={() => onSelect(reading.id)}
            className={`w-full card-glam rounded-2xl p-6 flex items-center gap-5 text-left transition-all ${
              selected === reading.id ? 'ring-2 ring-pink-400 shadow-lg' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={reading.image} alt={reading.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-display text-xl text-purple-800">{reading.name}</h3>
              <p className="font-display text-2xl text-pink-600">${reading.price}</p>
            </div>
            <div className="text-purple-300 text-2xl">&rarr;</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepFormat({ selected, onSelect, onBack }: { selected: ReadingFormatId | null; onSelect: (fmt: ReadingFormatId) => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-purple-900 text-center mb-2">How Would You Like Your Reading?</h2>
      <p className="text-purple-600/70 font-body text-center mb-8">Choose what works best for you</p>
      <div className="space-y-4">
        {READING_FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => onSelect(fmt.id)}
            className={`w-full card-glam rounded-2xl p-6 text-left transition-all hover:shadow-lg ${
              selected === fmt.id ? 'ring-2 ring-pink-400' : ''
            }`}
          >
            <h3 className="font-display text-xl text-purple-800 mb-1">{fmt.label}</h3>
            <p className="text-purple-600/70 font-body text-base">{fmt.description}</p>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="mt-6 text-purple-500 font-display text-sm tracking-wider hover:text-pink-500 transition-colors">
        &larr; Back
      </button>
    </div>
  );
}

function StepDateTime({ selectedDate, selectedTime, onSelect, onBack }: {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pickedDate, setPickedDate] = useState<string | null>(selectedDate);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart);

  useEffect(() => {
    if (!pickedDate) return;
    setLoadingTimes(true);
    fetch(`/api/availability?date=${pickedDate}&_t=${Date.now()}`)
      .then(r => r.json())
      .then(data => setAvailableTimes(data.availableTimes || []))
      .catch(() => setAvailableTimes([]))
      .finally(() => setLoadingTimes(false));
  }, [pickedDate]);

  return (
    <div>
      <h2 className="font-display text-3xl text-purple-900 text-center mb-8">Pick a Date & Time</h2>

      <div className="card-glam rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(m => addDays(startOfMonth(m), -1))} className="text-purple-500 hover:text-pink-500 p-2 font-display text-lg">&larr;</button>
          <h3 className="font-display text-lg text-purple-800">{format(currentMonth, 'MMMM yyyy')}</h3>
          <button onClick={() => setCurrentMonth(m => addDays(endOfMonth(m), 1))} className="text-purple-500 hover:text-pink-500 p-2 font-display text-lg">&rarr;</button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-xs font-display text-purple-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDow }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const past = isBefore(day, today);
            const selected = pickedDate === dateStr;
            const todayDay = isToday(day);
            const inMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={dateStr}
                disabled={past || !inMonth}
                onClick={() => setPickedDate(dateStr)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-body transition-all ${
                  selected ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-md' :
                  past ? 'text-purple-200 cursor-not-allowed' :
                  todayDay ? 'bg-pink-50 text-pink-600 font-bold' :
                  'text-purple-700 hover:bg-pink-50'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {pickedDate && (
        <div className="card-glam rounded-2xl p-6">
          <h3 className="font-display text-lg text-purple-800 mb-4">Available Times for {formatDate(pickedDate)}</h3>
          {loadingTimes ? (
            <p className="text-purple-400 font-body text-center py-4">Loading available times...</p>
          ) : availableTimes.length === 0 ? (
            <p className="text-purple-400 font-body text-center py-4">No available times for this date. Please choose another day.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableTimes.map(time => (
                <button
                  key={time}
                  onClick={() => onSelect(pickedDate, time)}
                  className={`py-2 px-3 rounded-xl text-sm font-display transition-all ${
                    selectedTime === time
                      ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-md'
                      : 'bg-purple-50 text-purple-700 hover:bg-pink-100 hover:text-pink-700'
                  }`}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button onClick={onBack} className="mt-6 text-purple-500 font-display text-sm tracking-wider hover:text-pink-500 transition-colors">
        &larr; Back
      </button>
    </div>
  );
}

function StepCustomerInfo({ booking, onChange, onSubmit, onBack }: {
  booking: BookingData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const valid = booking.customerName.trim() && booking.customerPhone.trim() && booking.customerEmail.trim() && booking.customerEmail.includes('@');

  return (
    <div>
      <h2 className="font-display text-3xl text-purple-900 text-center mb-2">Your Information</h2>
      <p className="text-purple-600/70 font-body text-center mb-8">So Cynthia can reach you for your reading</p>

      <div className="card-glam rounded-2xl p-6 space-y-5">
        <div>
          <label className="block font-display text-sm text-purple-700 mb-1 tracking-wider">Full Name</label>
          <input
            type="text"
            value={booking.customerName}
            onChange={e => onChange('customerName', e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 font-body text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block font-display text-sm text-purple-700 mb-1 tracking-wider">Phone Number</label>
          <input
            type="tel"
            value={booking.customerPhone}
            onChange={e => onChange('customerPhone', e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 font-body text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            placeholder="(555) 555-5555"
          />
        </div>
        <div>
          <label className="block font-display text-sm text-purple-700 mb-1 tracking-wider">Email</label>
          <input
            type="email"
            value={booking.customerEmail}
            onChange={e => onChange('customerEmail', e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 font-body text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={onBack} className="text-purple-500 font-display text-sm tracking-wider hover:text-pink-500 transition-colors">
          &larr; Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!valid}
          className={`btn-glam text-sm !py-2 !px-6 ${!valid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StepReview({ booking, reading, onError, onBack }: {
  booking: BookingData;
  reading: typeof READING_TYPES[number];
  onError: (msg: string) => void;
  onBack: () => void;
}) {
  const fmt = READING_FORMATS.find(f => f.id === booking.readingFormat);
  const paypalRef = useRef<HTMLDivElement>(null);
  const bookingIdRef = useRef<string>('');
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const renderedRef = useRef(false);

  const createOrder = useCallback(async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        readingType: booking.readingType,
        readingFormat: booking.readingFormat,
        date: booking.date,
        startTime: booking.startTime,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data;
  }, [booking]);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    async function loadPayPal() {
      try {
        const configRes = await fetch('/api/paypal-config');
        const configData = await configRes.json();
        if (!configRes.ok || !configData.clientId) {
          onError('PayPal is not configured yet. Please contact Cynthia to complete setup.');
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).paypal) {
          setPaypalReady(true);
          return;
        }

        script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${configData.clientId}&currency=USD&disable-funding=paylater,credit`;
        script.onload = () => setPaypalReady(true);
        script.onerror = () => onError('Failed to load PayPal. Please refresh and try again.');
        document.body.appendChild(script);
      } catch {
        onError('Failed to initialize payment. Please refresh and try again.');
      }
    }

    loadPayPal();

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onError]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!paypalReady || !paypalRef.current || renderedRef.current || !(window as any).paypal) return;
    renderedRef.current = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'pill',
        label: 'pay',
        height: 50,
      },
      createOrder: async () => {
        setProcessing(true);
        onError('');
        try {
          const result = await createOrder();
          bookingIdRef.current = result.bookingId;
          return result.orderId;
        } catch (err) {
          onError(err instanceof Error ? err.message : 'Something went wrong');
          setProcessing(false);
          throw err;
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onApprove: async (data: any) => {
        try {
          const res = await fetch('/api/checkout/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.orderID,
              bookingId: bookingIdRef.current,
              bookingDetails: {
                customerName: booking.customerName,
                customerPhone: booking.customerPhone,
                customerEmail: booking.customerEmail,
                readingType: booking.readingType,
                readingFormat: booking.readingFormat,
                date: booking.date,
                startTime: booking.startTime,
                totalPrice: reading.price,
              },
            }),
          });
          const captureData = await res.json();

          if (captureData.status === 'COMPLETED') {
            window.location.href = `/booking/success?booking_id=${captureData.bookingId}`;
          } else {
            onError('Payment was not completed. Please try again.');
            setProcessing(false);
          }
        } catch {
          onError('Failed to confirm payment. Please contact us.');
          setProcessing(false);
        }
      },
      onCancel: () => {
        setProcessing(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        console.error('PayPal error:', err);
        onError('Payment error. Please try again.');
        setProcessing(false);
      },
    }).render(paypalRef.current);
  }, [paypalReady, createOrder, onError]);

  return (
    <div>
      <h2 className="font-display text-3xl text-purple-900 text-center mb-2">Review Your Booking</h2>
      <p className="text-purple-600/70 font-body text-center mb-8">Confirm everything looks good, then pay with PayPal</p>

      <div className="card-glam rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-purple-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={reading.image} alt={reading.name} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-display text-xl text-purple-800">{reading.name}</h3>
            <p className="font-display text-2xl text-pink-600">${reading.price}</p>
          </div>
        </div>

        <div className="space-y-3 text-base font-body">
          <div className="flex justify-between">
            <span className="text-purple-500">Format</span>
            <span className="text-purple-800 font-medium">{fmt?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Date</span>
            <span className="text-purple-800 font-medium">{booking.date ? formatDate(booking.date) : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Time</span>
            <span className="text-purple-800 font-medium">{booking.startTime ? formatTime(booking.startTime) : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Name</span>
            <span className="text-purple-800 font-medium">{booking.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Phone</span>
            <span className="text-purple-800 font-medium">{booking.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">Email</span>
            <span className="text-purple-800 font-medium">{booking.customerEmail}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-100 flex justify-between items-center">
          <span className="font-display text-lg text-purple-700">Total</span>
          <span className="font-display text-3xl text-pink-600">${reading.price}</span>
        </div>
      </div>

      <div className="mt-6">
        {processing && (
          <p className="text-center text-purple-500 font-body text-sm mb-4">Processing your payment...</p>
        )}
        <div ref={paypalRef} className="min-h-[55px]">
          {!paypalReady && (
            <div className="text-center py-4">
              <p className="text-purple-400 font-body text-sm">Loading PayPal...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button onClick={onBack} disabled={processing} className="text-purple-500 font-display text-sm tracking-wider hover:text-pink-500 transition-colors disabled:opacity-50">
          &larr; Back
        </button>
      </div>
    </div>
  );
}
