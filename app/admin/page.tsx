'use client';

import { useState } from 'react';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  readingType: string;
  readingFormat: string;
  date: string;
  startTime: string;
  totalPrice: number;
  confirmedAt: string;
}

const readingNames: Record<string, string> = {
  diamond: 'Diamond Reading',
  signature: 'Signature Reading',
  crossover: 'Crossover Reading',
};

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function isUpcoming(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, mo, d] = dateStr.split('-').map(Number);
  const bookingDate = new Date(y, mo - 1, d);
  return bookingDate >= today;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError('Incorrect password');
        return;
      }

      setBookings(data.bookings);
      setLoggedIn(true);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  }

  if (!loggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a0a2e',
        fontFamily: 'Georgia, serif',
      }}>
        <form onSubmit={handleLogin} style={{
          background: '#2d1b4e',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #d4af37',
          textAlign: 'center',
          maxWidth: '360px',
          width: '90%',
        }}>
          <h1 style={{ color: '#d4af37', fontSize: '24px', marginBottom: '8px' }}>
            Cynthia Faye
          </h1>
          <p style={{ color: '#c9a0dc', marginBottom: '24px', fontSize: '14px' }}>
            Admin Dashboard
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #d4af37',
              background: '#1a0a2e',
              color: '#fff',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: '#ff6b6b', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #d4af37, #f0c96b)',
              color: '#1a0a2e',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  const upcoming = bookings.filter(b => isUpcoming(b.date));
  const past = bookings.filter(b => !isUpcoming(b.date));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a0a2e',
      padding: '20px',
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#d4af37', fontSize: '22px', margin: 0 }}>My Bookings</h1>
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d4af37',
              background: 'transparent',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {loading ? '...' : 'Refresh'}
          </button>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#c9a0dc',
          }}>
            <p style={{ fontSize: '18px' }}>No bookings yet</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>Bookings will appear here after customers pay</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <h2 style={{ color: '#c9a0dc', fontSize: '16px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Upcoming ({upcoming.length})
                </h2>
                {upcoming.map(b => <BookingCard key={b.id} booking={b} highlight />)}
              </>
            )}
            {past.length > 0 && (
              <>
                <h2 style={{ color: '#c9a0dc', fontSize: '16px', marginTop: '32px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Past ({past.length})
                </h2>
                {past.map(b => <BookingCard key={b.id} booking={b} />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, highlight }: { booking: Booking; highlight?: boolean }) {
  const borderColor = highlight ? '#d4af37' : '#4a3066';

  return (
    <div style={{
      background: '#2d1b4e',
      border: `1px solid ${borderColor}`,
      borderRadius: '10px',
      padding: '16px 20px',
      marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ color: '#fff', fontSize: '17px', fontWeight: 'bold', marginBottom: '4px' }}>
            {booking.customerName}
          </div>
          <div style={{ color: '#c9a0dc', fontSize: '14px' }}>
            {readingNames[booking.readingType] || booking.readingType} &bull; {booking.readingFormat === 'phone' ? 'Phone' : 'In Person'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#d4af37', fontSize: '16px', fontWeight: 'bold' }}>
            ${booking.totalPrice}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px' }}>
        <div>
          <span style={{ color: '#888' }}>Date: </span>
          <span style={{ color: '#fff' }}>{formatDate(booking.date)}</span>
        </div>
        <div>
          <span style={{ color: '#888' }}>Time: </span>
          <span style={{ color: '#fff' }}>{formatTime(booking.startTime)}</span>
        </div>
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px' }}>
        <div>
          <span style={{ color: '#888' }}>Phone: </span>
          <a href={`tel:${booking.customerPhone}`} style={{ color: '#7ecbff', textDecoration: 'none' }}>{booking.customerPhone}</a>
        </div>
        <div>
          <span style={{ color: '#888' }}>Email: </span>
          <span style={{ color: '#c9a0dc' }}>{booking.customerEmail}</span>
        </div>
      </div>
    </div>
  );
}
