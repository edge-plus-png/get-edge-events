import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import BookingForm from './BookingForm';

type EventRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: string;
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

interface Props {
  params: { slug: string };
}

export default async function EventPage({ params }: Props) {
  const { rows } = await sql<EventRow>`
    SELECT
      "id",
      "name",
      "slug",
      "description",
      "date"::text,
      "startTime",
      "endTime",
      "venueName",
      "venueAddress"
    FROM "Event"
    WHERE "slug" = ${params.slug}
    LIMIT 1;
  `;

  const event = rows[0];
  if (!event) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <section>
        <h1 className="text-2xl font-semibold mb-2">{event.name}</h1>
        <p className="text-sm mb-3 text-gray-700">
          {event.description ??
            'A relaxed networking lunch. Come along, say hello and connect with other local business owners.'}
        </p>

        <div className="border rounded-lg p-4 text-sm">
          <p>
            <strong>Date:</strong> {formatDate(event.date)}
          </p>
          <p>
            <strong>Time:</strong> {event.startTime}
            {event.endTime ? ` – ${event.endTime}` : ''}
          </p>
          <p>
            <strong>Venue:</strong> {event.venueName}, {event.venueAddress}
          </p>
          <p className="mt-2">
            <strong>Payment:</strong> Pay on exit – order what you like and pay
            the venue directly.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Reserve your place</h2>
        <p className="text-sm text-gray-700 mb-4">
          Add your details below to reserve a seat. You’ll pay at the venue on the day.
        </p>
        <BookingForm eventId={event.id} />
      </section>
    </main>
  );
}