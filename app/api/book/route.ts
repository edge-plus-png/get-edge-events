import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      name,
      email,
      partySize,
      company,
      notes,
      marketingConsent,
    } = body;

    if (!eventId || !name || !email || !partySize) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const size = Number(partySize);
    if (Number.isNaN(size) || size < 1 || size > 10) {
      return NextResponse.json(
        { error: 'Number of people must be between 1 and 10.' },
        { status: 400 }
      );
    }

    // Check event exists
    const check = await sql`
      SELECT 1 FROM "Event" WHERE "id" = ${eventId} LIMIT 1;
    `;
    if (check.rowCount === 0) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 }
      );
    }

    const id = `booking_${randomUUID()}`;

    await sql`
      INSERT INTO "Booking" (
        "id",
        "eventId",
        "name",
        "email",
        "partySize",
        "company",
        "notes",
        "marketingConsent",
        "paymentStatus"
      )
      VALUES (
        ${id},
        ${eventId},
        ${name.trim()},
        ${email.toLowerCase().trim()},
        ${size},
        ${company || null},
        ${notes || null},
        ${!!marketingConsent},
        'UNPAID'
      );
    `;

    return NextResponse.json(
      { success: true, bookingId: id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error in /api/book', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}