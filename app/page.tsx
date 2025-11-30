// app/page.tsx
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

export default async function HomePage() {
  let rows: EventRow[] = [];

  try {
    // Be very loose here: no assumptions about column names except id/name/slug.
    const result = await pool.query<any>('SELECT * FROM "Event";');
    rows = result.rows.map((r: any) => ({
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
    }));
  } catch (err) {
    console.error('HomePage DB error:', err);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
       <h1 className="text-2xl font-semibold mb-1">edge lunches & socials v2</h1>
        <p className="text-sm text-gray-600">
          Casual networking events in Taunton. Reserve your place, pay at the venue.
        </p>
      </header>

      {rows.length === 0 && (
        <p>No events available yet, or there was an issue loading events.</p>
      )}

      <div className="space-y-4">
        {rows.map((event) => (
          <div key={event.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-1">{event.name}</h2>
            <p className="text-sm">
              {formatDate(event)}
              {event.startTime && <> · {event.startTime}</>}
              {event.endTime && <> – {event.endTime}</>}
            </p>
            {(event.venueName || event.venueAddress) && (
              <p className="text-sm">
                {event.venueName}
                {event.venueName && event.venueAddress ? ', ' : ''}
                {event.venueAddress}
              </p>
            )}
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