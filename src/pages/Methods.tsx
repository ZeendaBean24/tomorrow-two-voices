const sections = [
  {
    title: 'Data intake',
    body: (
      <p>
        Seeds arrive through community climate labs, youth workshops, and the
        online form. Facilitators review each submission for clarity and
        future-facing scope before it enters the incubation queue.
      </p>
    ),
  },
  {
    title: 'PII removal',
    body: (
      <p>
        We hand-redact personally identifiable details (names, addresses,
        contact info) and compress location or organization mentions to
        generalized descriptors to keep the archive safe for public browsing.
      </p>
    ),
  },
  {
    title: 'Gemini manual workflow',
    body: (
      <p>
        Facilitators co-write with Gemini using a fixed instruction sheet. The
        prompt asks for two short narratives—one hopeful, one
        cautionary—grounded in the seed context, retaining given entities, and
        avoiding named individuals not present in the seed.
      </p>
    ),
  },
  {
    title: 'Scoring rules',
    body: (
      <p>
        Each artifact receives human-coded metrics: entity fidelity coverage,
        contradiction count, concreteness tallies (time, place, object, sensory
        cues), and hallucination spot checks for invented proper nouns. These
        are saved alongside the story JSON.
      </p>
    ),
  },
  {
    title: 'Ethics & consent',
    body: (
      <p>
        Contributors grant consent for non-commercial research reuse. We
        withhold seeds that surface trauma, hate, or private data, and we invite
        flagged removals at any time through the contact channel below.
      </p>
    ),
  },
  {
    title: 'Removal process',
    body: (
      <p>
        Email{' '}
        <a
          href="mailto:tomorrowvoices@example.com"
          className="font-medium text-indigo"
        >
          tomorrowvoices@example.com
        </a>{' '}
        with the artifact ID and reason for removal. We acknowledge within 48
        hours and scrub traces in the next dataset push.
      </p>
    ),
  },
  {
    title: 'Dataset versioning',
    body: (
      <p>
        JSON datasets are versioned by release date. GitHub tags reflect schema
        revisions, and changelogs document seeds added, updated, or removed.
      </p>
    ),
  },
]

const Methods = () => (
  <section
    data-section="methods"
    className="section-root flex min-h-screen flex-col gap-12 pb-24"
  >
    <header className="max-w-3xl space-y-4">
      <h1 className="glass-text text-4xl text-slate">Methods playbook</h1>
      <p className="glass-body text-lg">
        Every artifact is a traceable collaboration between human prompts and
        machine speculation. Our workflow keeps the voices safe, accountable,
        and remixable.
      </p>
    </header>
    <div className="grid gap-6">
      {sections.map(({ title, body }) => (
        <section
          key={title}
          aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}
          className="glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-indigo-500/30 rounded-3xl border border-white/25 bg-white/18 p-6"
        >
          <div className="glass-scrim space-y-3">
            <h2
              id={title.replace(/\s+/g, '-').toLowerCase()}
              className="glass-heading text-2xl"
            >
              {title}
            </h2>
            <div className="prose prose-slate mt-1 max-w-none text-base glass-body">
              {body}
            </div>
          </div>
        </section>
      ))}
    </div>
  </section>
)

export default Methods
