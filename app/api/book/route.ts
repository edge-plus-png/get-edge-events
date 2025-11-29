import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import pool from '@/lib/db';

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

    const client = await pool.connect();
    try {
      // Check event exists
      const check = await client.query(
        `SELECT 1 FROM "Event" WHERE "id" = $1 LIMIT 1`,
        [eventId],
      );
      if (check.rowCount === 0) {
        return NextResponse.json(
          { error: 'Event not found.' },
          { status: 404 }
        );
      }

      const id = `booking_${randomUUID()}`;

      await client.query(
        `INSERT INTO "Booking" (
          "id",
          "eventId",
          "name",
          "email",
          "partySize",
          "company",
          "notes",
          "marketingConsent",
          "paymentStatus"
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'UNPAID')`,
        [
          id,
          eventId,
          name.trim(),
          email.toLowerCase().trim(),
          size,
          company || null,
          notes || null,
          !!marketingConsent,
        ]
      );

      return NextResponse.json(
        { success: true, bookingId: id },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error in /api/book', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}