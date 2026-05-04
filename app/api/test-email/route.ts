import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    return NextResponse.json({
      error: 'Not configured',
      hasResendKey: !!resendKey,
      keyStart: resendKey ? resendKey.substring(0, 6) : 'missing',
      notifyEmail: notifyEmail || 'missing',
    });
  }

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
        subject: 'Test Email - Cynthia Faye Booking System',
        html: '<h2>This is a test email!</h2><p>If you see this, email notifications are working correctly.</p>',
      }),
    });

    const data = await res.text();
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      response: data,
      sentTo: notifyEmail,
    });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed',
    });
  }
}
