// app/events/ludacrust-dec-16/page.tsx

import Link from 'next/link';

export const dynamic = 'force-static';

export default function LudacrustEventPage() {
  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/">← Back to events</Link>
      </p>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
        Ludacrust Pizza Lunch
      </h1>

      <p style={{ marginBottom: '0.5rem', color: '#555' }}>
        Mon 16 Dec · 12:30
      </p>

      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Ludacrust, 4-6 Magdalene Ln, Taunton TA1 1SE
      </p>

      <p style={{ marginBottom: '1.5rem' }}>
        Casual networking pizza lunch. Pay on exit – order what you like and pay the restaurant directly.
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