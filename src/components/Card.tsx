import { useId, useMemo, useState } from 'react'
import { MetaPill, ThemeChip } from './Chips'
import type { Story, StoryVariantId } from '../lib/types'
import { useTilt } from '../lib/useTilt'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

const STORY_ORDER: StoryVariantId[] = ['hopeful', 'balanced', 'cautionary']

const VARIANT_LABELS: Record<StoryVariantId, string> = {
  hopeful: 'Hopeful',
  balanced: 'Balanced',
  cautionary: 'Cautionary',
}

type StoryCardProps = {
  story: Story
  anchorId?: string
}

const clampVariantIndex = (value: number) =>
  Math.min(Math.max(Math.round(value), 0), STORY_ORDER.length - 1)

const StoryCard = ({ story, anchorId }: StoryCardProps) => {
  const [copied, setCopied] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [variantIndex, setVariantIndex] = useState(0)
  const sliderId = useId()
  const tiltRef = useTilt({
    maxDeg: 5,
    baseShadow: '0.08',
    activeShadow: '0.2',
  })
  const prefersReducedMotion = usePrefersReducedMotion()

  const submittedLabel = useMemo(() => {
    const submitted = story.submitted_at ? new Date(story.submitted_at) : null
    if (!submitted || Number.isNaN(submitted.valueOf())) return 'Unspecified'
    return submitted.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [story.submitted_at])

  const seedDetails = useMemo(
    () =>
      (
        [
          ['Hope', story.seed.hope],
          ['Worry', story.seed.worry],
          ['AI future', story.seed.ai_future],
          ['Technology', story.seed.technology],
          ['Object', story.seed.object],
          ['Place', story.seed.place],
          ['Time', story.seed.time],
          ['Person / role', story.seed.person_or_role],
          ['Value', story.seed.value],
          ['Sensory detail', story.seed.sensory_detail],
        ] as const
      )
        .filter(([, value]) => Boolean(value?.trim()))
        .map(([label, value]) => ({ label, value: value.trim() })),
    [story.seed],
  )

  const activeVariantId = STORY_ORDER[variantIndex] ?? 'hopeful'
  const fallbackVariant = useMemo(
    () => ({
      title: `${VARIANT_LABELS[activeVariantId]} story forthcoming`,
      text: 'This story will be added soon.',
    }),
    [activeVariantId],
  )
  const activeVariant = story.ai[activeVariantId] ?? fallbackVariant

  const metricKeys = useMemo(
    () => Object.keys(story.metrics ?? {}).filter(Boolean),
    [story.metrics],
  )

  const handleCopyLink = async () => {
    try {
      if (!navigator.clipboard) return
      const url = new URL(window.location.href)
      url.hash = `#${anchorId ?? story.id}`
      await navigator.clipboard.writeText(url.toString())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Unable to copy link', error)
    }
  }

  const handleVariantChange = (value: number) => {
    setVariantIndex(clampVariantIndex(value))
  }

  const frontFace = (
    <section
      className="flip-face glass-scrim flex h-full flex-col gap-5"
      aria-label="Seed inputs"
      aria-hidden={prefersReducedMotion ? false : isFlipped}
      style={{
        pointerEvents: prefersReducedMotion ? 'auto' : isFlipped ? 'none' : 'auto',
      }}
    >
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate/60">
          Human prompt
        </p>
        <h2 className="glass-heading text-2xl">Seed {story.id}</h2>
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        {seedDetails.map(({ label, value }) => (
          <div
            key={label}
            className="glass-panel flex flex-col gap-1 rounded-2xl border border-white/20 bg-white/18 p-4 text-sm text-slate/85"
          >
            <dt className="text-[11px] uppercase tracking-[0.3em] text-slate/50">
              {label}
            </dt>
            <dd className="glass-body text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate/50">
          Themes
        </p>
        <div className="flex flex-wrap gap-2">
          {story.seed.themes.map((theme) => (
            <ThemeChip key={theme} label={theme} tone="slate" />
          ))}
        </div>
      </div>
    </section>
  )

  const backFace = (
    <section
      className="flip-face flip-back glass-scrim flex h-full flex-col gap-6"
      aria-label="AI stories"
      aria-hidden={prefersReducedMotion ? !isFlipped : !isFlipped}
      style={{
        pointerEvents: prefersReducedMotion ? 'auto' : !isFlipped ? 'none' : 'auto',
      }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
        <div className="space-y-4">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate/60">
              AI retellings
            </p>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="glass-heading text-xl">{activeVariant.title}</h3>
              <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-medium text-slate/75 ring-1 ring-white/30">
                {VARIANT_LABELS[activeVariantId]}
              </span>
            </div>
          </header>

          <div className="space-y-3">
            <label
              htmlFor={sliderId}
              className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-slate/60"
            >
              <span>Hopeful</span>
              <span>Balanced</span>
              <span>Cautionary</span>
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={STORY_ORDER.length - 1}
              step={1}
              value={variantIndex}
              onChange={(event) => handleVariantChange(Number(event.target.value))}
              className="h-[3px] w-full appearance-none rounded-full bg-slate/20 accent-indigo focus-visible:focus-ring"
              aria-valuemin={0}
              aria-valuemax={STORY_ORDER.length - 1}
              aria-valuenow={variantIndex}
              aria-label="Select AI story voice"
            />
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] uppercase tracking-[0.2em] text-slate/60">
              {STORY_ORDER.map((variant, index) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => handleVariantChange(index)}
                  className={`rounded-full px-2 py-1 font-medium transition focus-visible:focus-ring ${
                    index === variantIndex
                      ? 'bg-white/28 text-slate shadow ring-emerald/30'
                      : 'bg-white/10 text-slate/70 hover:bg-white/18'
                  }`}
                >
                  {VARIANT_LABELS[variant]}
                </button>
              ))}
            </div>
          </div>

          <article className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/18 p-6 text-slate/85 shadow-lg">
            <div
              className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-80"
              aria-hidden="true"
            />
            <div className="relative space-y-4">
              <p className="glass-body whitespace-pre-line text-base leading-relaxed">
                {activeVariant.text}
              </p>
            </div>
          </article>
        </div>

        <aside className="grid content-start gap-4 rounded-3xl border border-white/20 bg-white/12 p-5 text-sm text-slate/85 shadow">
          <div className="space-y-2">
            <h4 className="glass-heading text-lg">Metrics</h4>
            {metricKeys.length ? (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {metricKeys.map((key) => (
                  <li key={key} className="capitalize">
                    {key.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate/65">
                Metrics will appear here once analysis is complete.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <h4 className="glass-heading text-lg">Seed context</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate/60">Language</dt>
                <dd className="font-medium text-slate">
                  {story.seed.language}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate/60">Age band</dt>
                <dd className="font-medium text-slate">
                  {story.seed.age_band}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate/60">Agency</dt>
                <dd className="font-medium text-slate">
                  {story.seed.central_actor}
                </dd>
              </div>
            </dl>
            <div className="space-y-1">
              <p className="text-slate/60">Themes</p>
              <div className="flex flex-wrap gap-2">
                {story.seed.themes.map((theme) => (
                  <ThemeChip key={`panel-${theme}`} label={theme} tone="slate" />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )

  const renderFaces = () => {
    if (prefersReducedMotion) {
      return isFlipped ? backFace : frontFace
    }

    return (
      <div className="flip-scene">
        <div
          className={`flip-card min-h-[520px] ${isFlipped ? 'is-flipped' : ''}`}
        >
          {frontFace}
          {backFace}
        </div>
      </div>
    )
  }

  return (
    <article
      ref={tiltRef}
      id={anchorId ?? story.id}
      className="tilt-layer glass-panel group relative grid gap-6 rounded-3xl bg-white/22 p-8"
      style={{ backgroundImage: 'url(/assets/paper-texture.svg)' }}
      aria-label={`Seed ${story.id}`}
    >
      <div className="glass-scrim space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <MetaPill label="ID" value={story.id} />
          <MetaPill label="Submitted" value={submittedLabel} />
          <MetaPill label="Agency" value={story.seed.central_actor} />
        </div>
        {renderFaces()}
        <div className="flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            onClick={() => setIsFlipped((current) => !current)}
            className="rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:focus-ring"
          >
            {isFlipped ? 'View seed inputs' : 'View AI stories'}
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-full border border-white/30 bg-white/18 px-3 py-2 font-medium text-slate/80 backdrop-blur-md transition hover:bg-white/28 focus-visible:focus-ring"
          >
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            href={`mailto:tomorrowvoices@example.com?subject=Removal request for ${story.id}`}
            className="rounded-full border border-oxblood/50 bg-oxblood/20 px-3 py-2 font-medium text-oxblood transition hover:bg-oxblood/30 focus-visible:focus-ring"
          >
            Report / Remove
          </a>
        </div>
      </div>
    </article>
  )
}

export default StoryCard
