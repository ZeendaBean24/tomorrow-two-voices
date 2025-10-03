const sections = [
  {
    title: 'Data intake',
    body: (
      <p>
        Seeds arrive through community climate labs, youth workshops, and the online form. Facilitators review each submission for clarity and future-facing scope before it enters the incubation queue.
      </p>
    ),
  },
  {
    title: 'PII removal',
    body: (
      <p>
        We hand-redact personally identifiable details (names, addresses, contact info) and compress location or organization mentions to generalized descriptors to keep the archive safe for public browsing.
      </p>
    ),
  },
  {
    title: 'Gemini manual workflow',
    body: (
      <p>
        Facilitators co-write with Gemini using a fixed instruction sheet. The prompt asks for two short narratives—one hopeful, one cautionary—grounded in the seed context, retaining given entities, and avoiding named individuals not present in the seed.
      </p>
    ),
  },
  {
    title: 'Scoring rules',
    body: (
      <p>
        Each artifact receives human-coded metrics: entity fidelity coverage, contradiction count, concreteness tallies (time, place, object, sensory cues), and hallucination spot checks for invented proper nouns. These are saved alongside the story JSON.
      </p>
    ),
  },
  {
    title: 'Ethics & consent',
    body: (
      <p>
        Contributors grant consent for non-commercial research reuse. We withhold seeds that surface trauma, hate, or private data, and we invite flagged removals at any time through the contact channel below.
      </p>
    ),
  },
  {
    title: 'Removal process',
    body: (
      <p>
        Email <a href="mailto:tomorrowvoices@example.com" className="font-medium text-focus">tomorrowvoices@example.com</a> with the artifact ID and reason for removal. We acknowledge within 48 hours and scrub traces in the next dataset push.
      </p>
    ),
  },
  {
    title: 'Dataset versioning',
    body: (
      <p>
        JSON datasets are versioned by release date. GitHub tags reflect schema revisions, and changelogs document seeds added, updated, or removed.
      </p>
    ),
  },
];

const Methods = () => (
  <section className="space-y-10">
    <header className="max-w-3xl space-y-4">
      <h1 className="font-display text-3xl text-slate-900">Methods playbook</h1>
      <p className="text-lg text-slate-700">
        Every artifact is a traceable collaboration between human prompts and machine speculation. Our workflow keeps the voices safe, accountable, and remixable.
      </p>
    </header>
    <div className="grid gap-6">
      {sections.map(({ title, body }) => (
        <section key={title} aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 id={title.replace(/\s+/g, '-').toLowerCase()} className="font-display text-2xl text-slate-900">
            {title}
          </h2>
          <div className="prose prose-slate mt-3 max-w-none text-base">{body}</div>
        </section>
      ))}
    </div>
  </section>
);

export default Methods;
