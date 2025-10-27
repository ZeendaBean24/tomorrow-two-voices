const Submit = () => (
  <section
    data-section="submit"
    className="section-root flex min-h-screen flex-col gap-10 pb-24"
  >
    <header className="max-w-3xl space-y-4">
      <h1 className="glass-text text-4xl text-slate">Contribute to <b>Tomorrow, In Two Voices!</b></h1>
      <p className="glass-body text-lg">
        Whether you are a student, a frontline worker, a caregiver, or <b>anyone</b>, we want to hear <b>YOUR</b> voice. Share a glimpse of your vision of daily life in 2050 by filling out our quick survey!
      </p>
    </header>
    <div className="glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg grid gap-4 rounded-3xl border border-cyan/35 bg-white/18 p-6 text-slate/85">
      <div className="glass-scrim space-y-3">
        <p>
          <span className="font-semibold text-emerald-700/85">
            ✅ Keep it grounded
          </span>{' '}
          in a specific place, routine, or sensory detail.
        </p>
        <p>
          <span className="font-semibold text-rust-600/85">🚫 Avoid</span> real
          names, addresses, phone numbers, or private identifiers.
        </p>
        <p>
          <span className="font-semibold text-gold-600/85">💡 Tell us</span> how
          your community experiences climate, tech, or social shifts.
        </p>
      </div>
    </div>
    <a
      href="https://forms.gle/placeholder"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-auto items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:bg-indigo-700 focus-visible:focus-ring"
    >
      Open submission form
    </a>
  </section>
)

export default Submit
