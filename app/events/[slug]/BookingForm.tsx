'use client';

import { useState } from 'react';

interface Props {
  eventId: string;
}

export default function BookingForm({ eventId }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          name,
          email,
          partySize,
          company,
          notes,
          marketingConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="border rounded-lg p-4 bg-green-50 text-sm">
        <h3 className="font-semibold mb-1">You’re booked in 🎉</h3>
        <p>
          Thanks, your place is reserved. You’ll pay at the venue when you leave.
          We’ll email your booking details to {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-sm">
      {error && (
        <div className="border border-red-400 bg-red-50 p-2 rounded text-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          className="border rounded w-full px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          className="border rounded w-full px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Number of people</label>
        <input
          type="number"
          className="border rounded w-full px-3 py-2"
          value={partySize}
          min={1}
          max={10}
          onChange={(e) => setPartySize(Number(e.target.value))}
          required
        />
        <p className="text-xs mt-1 text-gray-600">
          Include yourself in this number.
        </p>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Company / organisation (optional)
        </label>
        <input
          className="border rounded w-full px-3 py-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your business name"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Anything we should know? (optional)
        </label>
        <textarea
          className="border rounded w-full px-3 py-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dietary needs, accessibility, or anything else."
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="marketingConsent"
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="marketingConsent">
          I’d like to receive occasional updates and invites to future edge events
          by email.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 border rounded font-medium"
      >
        {loading ? 'Reserving…' : 'Reserve my place'}
      </button>
    </form>
  );
}