// app/api/book/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Resend } from 'resend';

const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type EventRow = {
  id: string;
  name: string;
  slug: string;
  date: string;
  startTime: string;
  endTime: string | null;
  venueName: string;
  venueAddress: string;
};

// 👇 This handles BOTH JSON and normal form posts
async function parseBookingBody(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  // JSON body (e.g. fetch('/api/book', { body: JSON.stringify(...) }))
  if (contentType.includes('application/json')) {
    return await req.json();
  }

  // Fallback: typical HTML form post (application/x-www-form-urlencoded)
  const raw = await req.text();
  const params = new URLSearchParams(raw);

  return {
    eventSlug: params.get('eventSlug'),
    name: params.get('name'),
    email: params.get('email'),
    notes: params.get('notes') || undefined,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await parseBookingBody(req)) || {};
    const { eventSlug, name, email, notes } = body as {
      eventSlug?: string;
      name?: string;
      email?: string;
      notes?: string;
    };

    if (!eventSlug || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // 1) Look up the event by slug
    const eventResult = await pool.query<EventRow>(
      `
        SELECT
          "id",
          "name",
          "slug",
          "date",
          "startTime",
          "endTime",
          "venueName",
          "venueAddress"
        FROM "Event"
        WHERE "slug" = $1
        LIMIT 1
      `,
      [eventSlug],
    );

    if (eventResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 },
      );
    }

    const event = eventResult.rows[0];

    // 2) Insert booking – matches your Booking table:
    // id (default), createdAt (default), eventId, name, email, notes
    const insertResult = await pool.query<{ id: string }>(
      `
        INSERT INTO "Booking" ("eventId", "name", "email", "notes")
        VALUES ($1, $2, $3, $4)
        RETURNING "id"
      `,
      [event.id, name, email, notes ?? null],
    );

    const bookingId = insertResult.rows[0].id;

    // 3) Fire-and-forget confirmation email (optional)
    if (resend && process.env.MAIL_FROM) {
      try {
        await resend.emails.send({
          from: process.env.MAIL_FROM,
          to: email,
          subject: `Your booking for ${event.name}`,
          text: [
            `Hi ${name},`,
            '',
            `Thanks for reserving a place for: ${event.name}`,
            '',
            `We’ve received your booking. You’ll pay at the venue on the day.`,
            '',
            'edge+ events',
          ].join('\n'),
        });
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr);
        // don’t break booking if email fails
      }
    }

    return NextResponse.json({ ok: true, bookingId }, { status: 200 });
  } catch (error) {
    console.error('Booking API error:', error);

    return NextResponse.json(
      {
        error: 'Booking failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}