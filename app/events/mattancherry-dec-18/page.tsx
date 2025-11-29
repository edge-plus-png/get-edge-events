// app/events/mattancherry-dec-18/page.tsx

import Link from 'next/link';

export const dynamic = 'force-static';

export default function MattancherryEventPage() {
  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/">← Back to events</Link>
      </p>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
        Mattancherry Curry Lunch
      </h1>

      <p style={{ marginBottom: '0.5rem', color: '#555' }}>
        Wed 18 Dec · 12:30
      </p>

      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Mattancherry, 10 Station Rd, Taunton TA1 1NH
      </p>

      <p style={{ marginBottom: '1.5rem' }}>
        Casual networking curry lunch. Pay on exit – order what you like and pay the restaurant directly.
      </p>

      <a
        href="#"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          borderRadius: 999,
          border: '1px solid #000',
          textDecoration: 'none',
        }}
      >
        Booking form coming soon
      </a>
    </main>
  );
}