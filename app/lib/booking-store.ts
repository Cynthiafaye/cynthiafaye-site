const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO = 'anirudhatalmale6-alt/cynthiafaye-bookings';
const BASE_URL = `https://api.github.com/repos/${REPO}/contents/bookings`;

interface StoredBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  readingType: string;
  readingFormat: string;
  date: string;
  startTime: string;
  totalPrice: number;
  paypalOrderId: string;
  confirmedAt: string;
}

export async function storeBooking(booking: StoredBooking): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.log('Booking store skipped: GITHUB_TOKEN not set');
    return false;
  }

  const filename = `${booking.date}_${booking.id}.json`;
  const content = Buffer.from(JSON.stringify(booking, null, 2)).toString('base64');

  try {
    const res = await fetch(`${BASE_URL}/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Booking: ${booking.customerName} - ${booking.date} ${booking.startTime}`,
        content,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to store booking:', err);
    return false;
  }
}

export async function getAllBookings(): Promise<StoredBooking[]> {
  if (!GITHUB_TOKEN) return [];

  try {
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const files = await res.json();

    const bookings: StoredBooking[] = [];
    for (const file of files) {
      if (file.name === '.gitkeep' || !file.name.endsWith('.json')) continue;

      const fileRes = await fetch(file.url, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
      });
      if (!fileRes.ok) continue;

      const fileData = await fileRes.json();
      const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
      bookings.push(JSON.parse(decoded));
    }

    bookings.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });

    return bookings;
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    return [];
  }
}
