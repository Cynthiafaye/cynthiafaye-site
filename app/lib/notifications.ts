interface BookingNotification {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  readingType: string;
  readingFormat: string;
  date: string;
  startTime: string;
  totalPrice: number;
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
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const readingNames: Record<string, string> = {
  diamond: 'Diamond Reading',
  signature: 'Signature Reading',
  crossover: 'Crossover Reading',
};

export async function sendBookingNotificationEmail(booking: BookingNotification) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    console.log('Email notification skipped: Resend not configured');
    return;
  }

  const readingName = readingNames[booking.readingType] || booking.readingType;
  const formattedDate = formatDate(booking.date);
  const formattedTime = formatTime(booking.startTime);
  const format = booking.readingFormat === 'phone' ? 'Phone' : 'In Person';

  const subject = `New Booking: ${readingName} - ${formattedDate} at ${formattedTime}`;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #9b59b6; border-bottom: 2px solid #ffd700; padding-bottom: 10px;">New Booking Received!</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr><td style="padding: 8px 0; color: #666;">Reading</td><td style="padding: 8px 0; font-weight: bold;">${readingName}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Format</td><td style="padding: 8px 0; font-weight: bold;">${format}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Date</td><td style="padding: 8px 0; font-weight: bold;">${formattedDate}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0; font-weight: bold;">${formattedTime}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Price</td><td style="padding: 8px 0; font-weight: bold; color: #e91e8c;">$${booking.totalPrice}</td></tr>
      </table>
      <h3 style="color: #9b59b6; margin-top: 20px;">Customer</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: bold;">${booking.customerName}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0; font-weight: bold;">${booking.customerPhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; font-weight: bold;">${booking.customerEmail}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 15px; background: #fdf2f8; border-left: 4px solid #e91e8c; border-radius: 4px;">
        ${booking.readingFormat === 'phone'
          ? `<strong>Call ${booking.customerName} at ${booking.customerPhone}</strong><br>at ${formattedTime} on ${formattedDate}`
          : `<strong>In-person reading at your office</strong><br>${formattedDate} at ${formattedTime}`
        }
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [notifyEmail.toLowerCase().trim()],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend email failed:', errText);
    } else {
      console.log('Email notification sent to', notifyEmail);
    }
  } catch (err) {
    console.error('Failed to send email notification:', err);
  }
}

export async function sendBookingNotificationSMS(booking: BookingNotification) {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
  const notifyPhone = process.env.NOTIFY_PHONE;

  if (!twilioSid || !twilioToken || !twilioFrom || !notifyPhone) {
    console.log('SMS notification skipped: Twilio not configured');
    return;
  }

  const readingName = readingNames[booking.readingType] || booking.readingType;
  const formattedDate = formatDate(booking.date);
  const formattedTime = formatTime(booking.startTime);
  const format = booking.readingFormat === 'phone' ? 'Phone' : 'In Person';

  const message = [
    `NEW BOOKING`,
    `${readingName} (${format})`,
    `${formattedDate} at ${formattedTime}`,
    `$${booking.totalPrice}`,
    ``,
    `${booking.customerName}`,
    `${booking.customerPhone}`,
    booking.readingFormat === 'phone'
      ? `Call them at ${formattedTime}`
      : `In-person at your office`,
  ].join('\n');

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
    const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: notifyPhone,
        From: twilioFrom,
        Body: message,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Twilio SMS failed:', errText);
    } else {
      console.log('SMS notification sent to', notifyPhone);
    }
  } catch (err) {
    console.error('Failed to send SMS notification:', err);
  }
}

export async function notifyNewBooking(booking: BookingNotification) {
  await Promise.allSettled([
    sendBookingNotificationEmail(booking),
    sendBookingNotificationSMS(booking),
  ]);
}
