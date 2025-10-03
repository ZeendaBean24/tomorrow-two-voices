const Submit = () => (
  <section className="space-y-8">
    <header className="max-w-3xl space-y-4">
      <h1 className="font-display text-3xl text-slate-900">Submit a seed</h1>
      <p className="text-lg text-slate-700">
        Share a glimpse of your ordinary or extraordinary tomorrow. We especially welcome youth, frontline workers, and caregivers imagining their daily routes in 2050.
      </p>
    </header>
    <div className="grid gap-4 text-slate-700">
      <p>✅ Keep it grounded in a specific place, routine, or sensory detail.</p>
      <p>🚫 Avoid real names, addresses, phone numbers, or private identifiers.</p>
      <p>💡 Tell us how your community experiences climate, tech, or social shifts.</p>
    </div>
    <a
      href="https://forms.gle/placeholder"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-auto items-center justify-center rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-focus"
    >
      Open submission form
    </a>
  </section>
);

export default Submit;
