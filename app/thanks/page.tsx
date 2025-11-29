// app/thanks/page.tsx

import Link from 'next/link';

export default function ThanksPage() {
  return (
    <main style={{ maxWidth: 600, margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Thanks – your place is reserved
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        We’ve recorded your booking. You’ll pay the restaurant directly on the day.
      </p>
      <p style={{ marginBottom: '2rem' }}>
        If anything changes, just reply to the confirmation email (once we hook
        that up) or contact edge+.
      </p>
      <Link href="/" style={{ textDecoration: 'underline' }}>
        ← Back to events
      </Link>
    </main>
  );
}