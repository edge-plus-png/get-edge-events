// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

type EventRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  date?: string;
  dateStamp?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  paymentMode?: string;
};

function toEventRow(r: any): EventRow {
  return {
    id: String(r.id),
    name: r.name,
    slug: r.slug,
    description: r.description ?? null,
    date: r.date ?? undefined,
    dateStamp: r.dateStamp ?? r['dateStamp'] ?? undefined,
    startTime: r.startTime ?? r['startTime'] ?? undefined,
    endTime: r.endTime ?? r['endTime'] ?? undefined,
    venueName: r.venueName ?? r['venueName'] ?? undefined,
    venueAddress: r.venueAddress ?? r['venueAddress'] ?? undefined,
    paymentMode: r.paymentMode ?? r['paymentMode'] ?? undefined,
  };
}

function formatDate(row: EventRow) {
  const raw = row.date ?? row.dateStamp ?? null;
  if (!raw) return 'Date TBC';

  const d = new Date(raw);
  if (isNaN(d.getTime())) return 'Date TBC';

  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

async function getEventBySlug(slug: string): Promise<EventRow | null> {
  try {
    const result = await pool.query<any>(
      `SELECT * FROM "Event" WHERE "slug" = $1 LIMIT 1;`,
      [slug],
    );

    if (!result.rows[0]) return null;
    return toEventRow(result.rows[0]);
  } catch (err) {
    console.error('DB error on getEventBySlug', err);
    return null;
  }
}

// 🔑 NOTE: params is now a Promise in Next 16 App Router
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ unwrap the Promise
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const formattedDate = formatDate(event);

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/">← Back to events</Link>
      </p>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{event.name}</h1>
      <p style={{ marginBottom: '0.5rem', color: '#555' }}>
        {formattedDate}
        {event.startTime && <> · {event.startTime.slice(0, 5)}</>}
        {event.endTime && <> – {event.endTime.slice(0, 5)}</>}
      </p>

      {(event.venueName || event.venueAddress) && (
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          {event.venueName}
          {event.venueName && event.venueAddress ? ', ' : ''}
          {event.venueAddress}
        </p>
      )}

      {event.description && (
        <p style={{ marginBottom: '1.5rem' }}>{event.description}</p>
      )}

      <p style={{ marginBottom: '0.75rem' }}>
        <strong>Payment:</strong>{' '}
        {event.paymentMode === 'PAY_ON_EXIT'
          ? 'Pay on exit – order what you like and pay the restaurant directly.'
          : 'Payment details will be confirmed.'}
      </p>

      {/* Booking link can be wired later */}
      {/* <Link href={`/events/${event.slug}/book`}>Reserve your place</Link> */}
    </main>
  );
}