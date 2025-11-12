const Submit = () => (
  <section
    data-section="submit"
    className="section-root flex min-h-screen flex-col gap-10 pb-24"
  >
    <header className="max-w-3xl space-y-4">
      <p className="text-xs uppercase tracking-[0.35em] text-slate/60">Submit</p>
      <h1 className="glass-text text-4xl text-slate">
        Keep the voices flowing
      </h1>
      <p className="glass-body text-lg">
        Version 1 of the seed collection (part of our School CAS project) is
        officially closed. We are preparing a public-facing Version 2 and will
        reopen the form with smarter prompts, more insights, richer metrics, and
        a larger seed set.
      </p>
    </header>

    <div className="glass-panel rounded-3xl border border-white/20 bg-white/18 p-6 text-slate/85">
      <div className="glass-scrim space-y-4">
        <h2 className="glass-heading text-2xl">Survey link</h2>
        <p className="text-sm text-slate/75">
          Whether you are a student, a frontline worker, a caregiver, or{' '}
          <b>anyone</b>, we want to hear <b>YOUR</b> voice. Share a glimpse of
          your vision of daily life in 2050 by filling out our quick survey! Seed
          submissions are temporarily paused while we upgrade the tooling, but
          you can still preview the form and leave your email for Version 2.
        </p>
        <div className="flex justify-center">
          <a
            href="https://tally.so/r/mRAq2l"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:bg-indigo-700 focus-visible:focus-ring"
          >
            Open submission form
          </a>
        </div>
      </div>
    </div>

    <div className="glass-panel glass-border-gold relative overflow-hidden rounded-3xl border border-white/30 bg-white/18 p-6 text-slate/85">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(16,185,129,0.15),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="glass-scrim relative space-y-4">
        <p className="glass-heading text-xl">Version 2 improvements</p>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>Smarter prompting tuned for youth + public submissions.</li>
          <li>More insights surfaced directly in the archive.</li>
          <li>More seeds crowdsourced across regions.</li>
          <li>Introduction of story metrics for every output.</li>
        </ul>
      </div>
    </div>
  </section>
)

export default Submit
