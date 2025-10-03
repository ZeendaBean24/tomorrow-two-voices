const Submit = () => (
  <section data-section="submit" className="section-root flex min-h-screen flex-col gap-10 pb-24">
    <header className="max-w-3xl space-y-4">
      <h1 className="text-4xl text-slate">Submit a seed</h1>
      <p className="text-lg text-slate/80">
        Share a glimpse of your ordinary or extraordinary tomorrow. We especially welcome youth, frontline workers, and caregivers imagining their daily routes in 2050.
      </p>
    </header>
    <div className="grid gap-4 rounded-3xl border border-cyan/30 bg-paper/95 p-6 text-slate/80 shadow-card">
      <p><span className="font-semibold text-emerald">✅ Keep it grounded</span> in a specific place, routine, or sensory detail.</p>
      <p><span className="font-semibold text-rust">🚫 Avoid</span> real names, addresses, phone numbers, or private identifiers.</p>
      <p><span className="font-semibold text-gold">💡 Tell us</span> how your community experiences climate, tech, or social shifts.</p>
    </div>
    <a
      href="https://forms.gle/placeholder"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-auto items-center justify-center rounded-full bg-cyan px-8 py-3 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:focus-ring"
    >
      Open submission form
    </a>
  </section>
);

export default Submit;
