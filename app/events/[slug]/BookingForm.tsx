'use client';

export default function BookingForm({ eventSlug }: { eventSlug: string }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch('/api/book', {
      method: 'POST',
      body: data, // this sends it as form-data
    });

    const json = await res.json();

    if (!res.ok) {
      alert('Booking failed: ' + json.details);
      return;
    }

    alert('Booking successful! Check your email.');
    form.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      method="POST"
      className="space-y-4 mt-6"
    >
      {/* Slug hidden field */}
      <input type="hidden" name="eventSlug" value={eventSlug} />

      <div>
        <label className="block text-sm mb-1">Your name</label>
        <input
          name="name"
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Notes (optional)</label>
        <textarea
          name="notes"
          className="border rounded px-3 py-2 w-full"
        ></textarea>
      </div>

      <button
        type="submit"
        className="border rounded-full px-6 py-2 mt-4"
      >
        Reserve my place
      </button>
    </form>
  );
}