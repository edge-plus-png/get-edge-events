// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

type EventRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  dateStamp: string;      // from your Prisma / DB
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  paymentMode: string;
};

async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const result = await pool.query<EventRow>(
    `
      SELECT
        "id",
        "name",
        "slug",
        "description",
        "dateStamp",
        "startTime",
        "endTime",
        "venueName",
        "venueAddress",
        "paymentMode"
      FROM "Event"
      WHERE "slug" = $1
      LIMIT 1;
    `,
    [slug],
  );

  return result.rows[0] ?? null;
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.dateStamp).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/">← Back to events</Link>
      </p>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{event.name}</h1>
      <p style={{ marginBottom: '0.5rem', color: '#555' }}>
        {formattedDate} · {event.startTime.slice(0, 5)} – {event.endTime.slice(0, 5)}
      </p>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        {event.venueName}, {event.venueAddress}
      </p>

      {event.description && (
        <p style={{ marginBottom: '1.5rem' }}>{event.description}</p>
      )}

      <p style={{ marginBottom: '0.75rem' }}>
        <strong>Payment:</strong>{' '}
        {event.paymentMode === 'PAY_ON_EXIT'
          ? 'Pay on exit – order what you like and pay the restaurant directly.'
          : 'Payment details will be confirmed.'}
      </p>
    </main>
  );
}