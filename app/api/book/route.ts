// app/api/book/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Resend } from 'resend';

// Optional email client
const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventSlug, name, email, notes } = body;

    // Basic validation
    if (!eventSlug || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1) Look up the event by slug
    const eventResult = await pool.query<{ id: string; name: string }>(
      `
        SELECT "id", "name"
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

    // 2) Insert booking
    // IMPORTANT: this assumes Booking has at least:
    // id (with default), createdAt (default), eventId, name, email, notes (nullable)
    const insertResult = await pool.query<{ id: string }>(
      `
        INSERT INTO "Booking" ("eventId", "name", "email", "notes")
        VALUES ($1, $2, $3, $4)
        RETURNING "id"
      `,
      [event.id, name, email, notes ?? null],
    );

    const bookingId = insertResult.rows[0].id;

    // 3) Try to send email (but don't fail the booking if email breaks)
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
            `We’ve received your booking. If you need to make any changes, just reply to this email.`,
            '',
            'edge+ events',
          ].join('\n'),
        });
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr);
        // Don’t throw – booking itself already succeeded
      }
    }

    return NextResponse.json(
      { ok: true, bookingId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      {
        error: 'Booking failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}