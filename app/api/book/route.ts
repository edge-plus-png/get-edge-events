// app/api/book/route.ts

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const eventSlug = String(formData.get('eventSlug') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const guestsRaw = String(formData.get('guests') || '1').trim();
    const marketingConsent = formData.get('marketingConsent') === 'on';

    const guests = Number(guestsRaw) || 1;

    if (!eventSlug || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Look up the event by slug to get its ID
    const eventResult = await pool.query<{ id: string }>(
      `SELECT "id" FROM "Event" WHERE "slug" = $1 LIMIT 1`,
      [eventSlug],
    );

    const event = eventResult.rows[0];

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found for this slug' },
        { status: 404 },
      );
    }

    // Insert booking
    await pool.query(
      `
        INSERT INTO "Booking" (
          "eventId",
          "name",
          "email",
          "guests",
          "marketingConsent"
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [event.id, name, email, guests, marketingConsent],
    );

    // Redirect to a simple thank-you page
    const url = new URL('/thanks', req.url);
    return NextResponse.redirect(url.toString(), { status: 303 });
  } catch (err) {
    console.error('Error handling booking', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}