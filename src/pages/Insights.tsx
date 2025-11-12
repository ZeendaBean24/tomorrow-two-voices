import { useEffect, useMemo, useState } from 'react'
import heroTexture from '@assets/paper-texture.svg'
import insightsSummaryData from '@data/insights_summary.json'

type TermRecord = { term: string; count: number }
type KeywordSection = {
  label: string
  unigrams: TermRecord[]
  bigrams: TermRecord[]
}
type DistributionRecord = { label: string; count: number; percent: number }

type InsightsSummary = {
  keywords: Record<string, KeywordSection>
  hope_vs_worry: {
    overlap: TermRecord[]
    hope_unique: TermRecord[]
    worry_unique: TermRecord[]
  }
  distributions: {
    agency: DistributionRecord[]
    age_band: DistributionRecord[]
    themes: DistributionRecord[]
  }
}

const insightsSummary = insightsSummaryData as InsightsSummary

const palette = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
  '#facc15',
]

const KeywordCloud = ({
  section,
  mode,
}: {
  section: KeywordSection
  mode: 'mixed' | 'unigram' | 'bigram'
}) => {
  const entries =
    mode === 'mixed'
      ? [
          ...section.unigrams.map((entry) => ({ ...entry, type: 'unigram' })),
          ...section.bigrams.map((entry) => ({ ...entry, type: 'bigram' })),
        ].sort((a, b) => b.count - a.count)
      : section[mode === 'unigram' ? 'unigrams' : 'bigrams'].map((entry) => ({
          ...entry,
          type: mode === 'unigram' ? 'unigram' : 'bigram',
        }))

  const maxCount = entries.reduce((max, item) => Math.max(max, item.count), 1)

  const modeLabel =
    mode === 'mixed' ? 'Mix of words + phrases' : mode === 'unigram' ? 'Words only' : 'Phrases only'

  return (
    <div className="glass-panel rounded-3xl border border-white/20 bg-white/18 p-6 text-slate/85">
      <div className="glass-scrim space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate/60">
          <span>Dual keyword cloud</span>
          <span className="text-[0.65rem] font-semibold text-slate/70 normal-case tracking-normal">
            {modeLabel}
          </span>
        </div>
        <div className="keyword-cloud" aria-label={`${section.label} keywords`}>
          {entries.map((entry) => {
            const weight = entry.count / maxCount
            const fontSize = 0.7 + weight * 1.45
            return (
              <span
                key={`${entry.type}-${entry.term}`}
                className={`keyword-token ${
                  entry.type === 'bigram' ? 'keyword-bigram' : ''
                }`}
                style={{ fontSize: `${fontSize}rem` }}
                data-count={entry.count}
                aria-label={`${entry.term} (${entry.count})`}
              >
                {entry.term}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const keywordModes = [
  { id: 'unigram', label: 'Words' },
  { id: 'bigram', label: 'Phrases' },
  { id: 'mixed', label: 'Mix' },
] as const

const KeywordDeck = ({ sections }: { sections: KeywordSection[] }) => {
  const initialModes = useMemo(
    () => Object.fromEntries(sections.map((section) => [section.label, 'unigram'])) as Record<string, 'mixed' | 'unigram' | 'bigram'>,
    [sections],
  )
  const [modes, setModes] = useState(initialModes)

  useEffect(() => {
    setModes(initialModes)
  }, [initialModes])

  const handleModeChange = (
    label: string,
    nextMode: 'mixed' | 'unigram' | 'bigram',
  ) => {
    setModes((prev) => ({ ...prev, [label]: nextMode }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {sections.map((section) => {
        const isValuesSection = section.label === 'Values We Lean On'
        const currentMode = isValuesSection
          ? 'unigram'
          : modes[section.label] ?? 'unigram'
        return (
          <div key={section.label} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="glass-heading text-xl">{section.label}</h3>
              {!isValuesSection && (
                <div className="flex rounded-full bg-white/40 p-1 text-xs font-semibold text-slate/70">
                  {keywordModes.map((option) => {
                    const active = option.id === currentMode
                    return (
                      <button
                        key={`${section.label}-${option.id}`}
                        type="button"
                        onClick={() => handleModeChange(section.label, option.id)}
                        className={`rounded-full px-3 py-1 transition focus-visible:focus-ring ${
                          active
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-transparent text-slate-600 hover:text-slate'
                        }`}
                        aria-pressed={active}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <KeywordCloud section={section} mode={currentMode} />
          </div>
        )
      })}
    </div>
  )
}

const ComparisonList = ({
  title,
  items,
}: {
  title: string
  items: TermRecord[]
}) => (
  <div className="space-y-3">
    <h3 className="glass-heading text-lg">{title}</h3>
    <ul className="space-y-1 text-sm text-slate/80">
      {items.slice(0, 12).map((item) => (
        <li key={item.term} className="flex items-center justify-between">
          <span className="font-medium text-slate-700">{item.term}</span>
          <span className="text-slate/70">{item.count}</span>
        </li>
      ))}
    </ul>
  </div>
)

const DistributionCard = ({
  title,
  items,
}: {
  title: string
  items: DistributionRecord[]
}) => (
  <div className="glass-panel rounded-3xl border border-white/20 bg-white/18 p-6 text-slate/85">
    <div className="glass-scrim space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate/60">
          Distribution
        </p>
        <h3 className="glass-heading text-xl">{title}</h3>
      </div>
      <div className="stacked-bar" role="img" aria-label={`${title} distribution`}>
        {items.map((item, index) => (
          <span
            key={item.label}
            className="stacked-bar__segment"
            style={{
              width: `${Math.max(item.percent, 1)}%`,
              backgroundColor: palette[index % palette.length],
            }}
            title={`${item.label}: ${item.percent.toFixed(2)}%`}
          />
        ))}
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate/70">
              {item.count} · {item.percent.toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const Insights = () => {
  const keywordSections = Object.values(insightsSummary.keywords)

  return (
    <section
      data-section="insights"
      className="section-root flex min-h-screen flex-col gap-12 pb-24"
    >
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate/60">
          Story intelligence
        </p>
        <h1 className="glass-text text-4xl text-slate">
          Keyword clouds & social distributions
        </h1>
        <p className="glass-body text-lg">
          We parse every seed to surface the language communities use when they
          describe AI futures, hopes, worries, and daily anchors. Dual clouds
          mix the top 50 unigrams and bigrams per field, while the stacked bars
          break down who is speaking.
        </p>
      </header>

      <div className="glass-panel glass-border-gold relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/18 p-10 text-center text-slate/85">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% -10%, rgba(245,158,11,0.25), transparent 65%), radial-gradient(circle at 90% 40%, rgba(79,70,229,0.18), transparent 65%), url(${heroTexture})`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
          }}
          aria-hidden="true"
        />
        <div className="glass-scrim relative space-y-3">
          <p className="glass-heading text-2xl">How to read these views</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate/90">
            <li>
              Larger keywords appear more often across the 106 cleaned seed
              records. Italic entries are bigrams.
            </li>
            <li>
              Distributions stack each population share so you can see who is
              most represented in the archive.
            </li>
          </ul>
        </div>
      </div>

      <section aria-labelledby="keyword-clouds" className="space-y-6">
        <h2 id="keyword-clouds" className="glass-heading text-2xl">
          Keyword analysis
        </h2>
        <KeywordDeck sections={keywordSections} />
      </section>

      <section aria-labelledby="distributions" className="space-y-6">
        <h2 id="distributions" className="glass-heading text-2xl">
          Who is speaking?
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <DistributionCard
            title="Agency"
            items={insightsSummary.distributions.agency}
          />
          <DistributionCard
            title="Age band"
            items={insightsSummary.distributions.age_band}
          />
          <DistributionCard
            title="Themes"
            items={insightsSummary.distributions.themes}
          />
        </div>
      </section>
    </section>
  )
}

export default Insights
