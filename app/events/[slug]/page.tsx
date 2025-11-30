// app/events/[slug]/page.tsx
import Link from 'next/link';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

type EventRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  dateStamp?: string; // just in case your column is called this
  date?: string;      // or this
  startTime?: string;
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  paymentMode?: string;
};

async function getEventBySlug(slug: string): Promise<EventRow | null> {
  try {
    const result = await pool.query<EventRow>(
      `
        SELECT
          "id",
          "name",
          "slug",
          "description",
          "dateStamp",
          "date",
          "startTime",
          "endTime",
          "venueName",
          "venueAddress",
          "paymentMode"
        FROM "Event"
        WHERE "slug" = $1
        LIMIT 1
      `,
      [slug],
    );

    return result.rows[0] ?? null;
  } catch (err) {
    console.error('DB error on getEventBySlug', err);
    return null;
  }
}

async function getAllEvents(): Promise<Pick<EventRow, 'id' | 'name' | 'slug'>[]> {
  try {
    const result = await pool.query<Pick<EventRow, 'id' | 'name' | 'slug'>>(
      `SELECT "id", "name", "slug" FROM "Event" ORDER BY "name" ASC`,
    );
    return result.rows;
  } catch (err) {
    console.error('DB error on getAllEvents', err);
    return [];
  }
}

export default async function EventPage({ params }: { params: { slug?: string } }) {
  const debugParams = JSON.stringify(params);
  const slug = params.slug ?? '';

  const [event, allEvents] = await Promise.all([
    slug ? getEventBySlug(slug) : Promise.resolve(null),
    getAllEvents(),
  ]);

  if (!event) {
    return (
      <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
        <p>
          <Link href="/">← Back to events</Link>
        </p>

        <h1>Debug: no event found</h1>

        <p>
          <strong>Slug from URL:</strong>{' '}
          <code>{slug || '(empty or undefined)'}</code>
        </p>

        <p>
          <strong>Raw params object:</strong>{' '}
          <code>{debugParams}</code>
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Events in DB</h2>
        {allEvents.length === 0 && <p>No events found in the Event table.</p>}
        {allEvents.length > 0 && (
          <ul>
            {allEvents.map((e) => (
              <li key={e.id}>
                <code>{e.slug}</code> – {e.name}
              </li>
            ))}
          </ul>
        )}

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
          If you see events listed above, use those exact slug values in the URL,
          e.g. <code>/events/&lt;slug-here&gt;</code>.
        </p>
      </main>
    );
  }

  // If it does find an event, show a simple page:
  const dateString = event.date ?? event.dateStamp ?? '';
  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Date TBC';

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <p>
        <Link href="/">← Back to events</Link>
      </p>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{event.name}</h1>
      <p style={{ marginBottom: '0.5rem', color: '#555' }}>
        {formattedDate}
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