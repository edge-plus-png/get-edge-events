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
        Our final Curry Lunch. Choose standard Thali (Chicken, Lamb, Veg, fish and Vegan) or the Special. Pay on exit.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
        Reserve your place
      </h2>

      <form
        method="POST"
        action="/api/book"
        style={{
          display: 'grid',
          gap: '0.75rem',
          maxWidth: 480,
        }}
      >
        <input type="hidden" name="eventSlug" value="mattancherry-dec-18" />

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Full name</span>
          <input
            name="name"
            required
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '0.5rem',
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Email address</span>
          <input
            type="email"
            name="email"
            required
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '0.5rem',
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>How many people?</span>
          <input
            type="number"
            name="guests"
            min={1}
            max={10}
            defaultValue={1}
            required
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '0.5rem',
              maxWidth: 120,
            }}
          />
        </label>

        <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem' }}>
          <input type="checkbox" name="marketingConsent" />
          <span>
            I’m happy for edge+ / GetEdge to email me about future lunches and
            events.
          </span>
        </label>

        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 999,
            border: '1px solid #000',
            background: '#000',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Confirm reservation
        </button>

        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          You’ll pay the restaurant directly on the day.
        </p>
      </form>
    </main>
  );
}