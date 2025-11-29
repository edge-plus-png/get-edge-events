// app/events/[slug]/page.tsx

export const dynamic = 'force-dynamic';

export default function EventDebugPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Debug event page</h1>
      <p>Slug from URL:</p>
      <pre
        style={{
          background: '#f3f3f3',
          padding: '1rem',
          borderRadius: 6,
        }}
      >
        {JSON.stringify(params, null, 2)}
      </pre>
      <p>
        If you see this, the dynamic route <code>app/events/[slug]/page.tsx</code>{' '}
        is working and Next is giving you the slug correctly.
      </p>
    </main>
  );
}