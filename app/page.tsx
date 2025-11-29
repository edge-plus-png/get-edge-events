import Link from 'next/link';
import pool from '@/lib/db';

type EventRow = {
  id: string;
  name: string;
  slug: string;
  date: string; // comes back as string
  startTime: string;
  endTime: string | null;
  venueName: string;
  venueAddress: string;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function HomePage() {
  const { rows } = await pool.query<EventRow>(`
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
    ORDER BY "date" ASC;
  `);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-1">edge lunches & socials</h1>
        <p className="text-sm text-gray-600">
          Casual networking events in Taunton. Reserve your place, pay at the venue.
        </p>
      </header>

      {rows.length === 0 && <p>No events available yet.</p>}

      <div className="space-y-4">
        {rows.map((event) => (
          <div key={event.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-1">{event.name}</h2>
            <p className="text-sm">
              {formatDate(event.date)} · {event.startTime}
              {event.endTime ? ` – ${event.endTime}` : ''}
            </p>
            <p className="text-sm">
              {event.venueName}, {event.venueAddress}
            </p>
            <p className="mt-2 text-xs text-gray-600">
              Pay on exit – order what you like and pay the restaurant directly.
            </p>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex mt-3 text-sm underline"
            >
              Reserve your place
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}