import { useMemo, useState } from 'react'
import type { Evidence, Influence } from '../lib/types'

const toKey = (storyId: string, phrase: string) =>
  `${storyId}-${phrase.toLowerCase().replace(/\s+/g, '-')}`

type EvidencePanelProps = {
  storyId: string
  evidence: Evidence[]
  highlightEnabled: boolean
  activeHighlightKey: string | null
  activeInfluences: Influence[]
  onHighlightToggle: (enabled: boolean) => void
  onActivateHighlight: (key: string, influences: Influence[]) => void
  onClearHighlight: () => void
}

const EvidencePanel = ({
  storyId,
  evidence,
  highlightEnabled,
  activeHighlightKey,
  activeInfluences,
  onHighlightToggle,
  onActivateHighlight,
  onClearHighlight,
}: EvidencePanelProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const coverageCount = useMemo(
    () => evidence.reduce((count, item) => count + item.influences.length, 0),
    [evidence],
  )

  const toggleExpand = (key: string) => {
    setExpanded((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel hover:-translate-y-0.5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/25 bg-white/18 p-4 hover:ring-indigo-500/30">
        <div className="glass-scrim flex w-full flex-wrap items-center gap-3">
          <span className="rounded-full border border-indigo/40 bg-indigo/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo">
            Trace coverage: {coverageCount}
          </span>
          <div className="flex flex-wrap gap-2" aria-label="Evidence legend">
            {evidence.map((item) => {
              const key = toKey(storyId, item.seed_phrase)
              const intersects = item.influences.some((influence) =>
                activeInfluences.some(
                  (active) =>
                    active.story === influence.story &&
                    active.sent_idx === influence.sent_idx,
                ),
              )
              const isActive = activeHighlightKey === key || intersects
              return (
                <button
                  key={key}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition focus-visible:focus-ring ${
                    isActive
                      ? 'border-indigo/60 bg-indigo/30 text-white shadow'
                      : 'border-white/30 bg-white/18 text-slate/80 hover:bg-white/24'
                  }`}
                  onMouseEnter={() => onActivateHighlight(key, item.influences)}
                  onFocus={() => onActivateHighlight(key, item.influences)}
                  onMouseLeave={() => onClearHighlight()}
                  onBlur={() => onClearHighlight()}
                  onClick={() =>
                    isActive
                      ? onClearHighlight()
                      : onActivateHighlight(key, item.influences)
                  }
                  aria-pressed={isActive}
                >
                  {item.seed_phrase}
                </button>
              )
            })}
          </div>
          <label className="glass-body ml-auto flex items-center gap-2 text-xs">
            <span>Highlight influences in story</span>
            <button
              type="button"
              role="switch"
              aria-checked={highlightEnabled}
              onClick={() => onHighlightToggle(!highlightEnabled)}
              className={`h-7 w-12 rounded-full border transition ${
                highlightEnabled
                  ? 'border-indigo bg-indigo/25'
                  : 'border-white/30 bg-white/18'
              }`}
            >
              <span
                className={`block h-5 w-5 translate-x-1 rounded-full bg-white shadow transition ${
                  highlightEnabled ? 'translate-x-6 bg-indigo' : 'bg-slate/40'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {evidence.map((item) => {
          const key = toKey(storyId, item.seed_phrase)
          const storyTargets = Array.from(
            new Set(item.influences.map((influence) => influence.story)),
          )
          const targetLabel =
            storyTargets.length === 2
              ? 'Both stories'
              : storyTargets[0] === 'hopeful'
                ? 'Hopeful story'
                : 'Cautionary story'
          const indicesLabel = item.influences
            .map(
              (influence) =>
                `${influence.story === 'hopeful' ? 'H' : 'C'}:s${influence.sent_idx}`,
            )
            .join(', ')
          const isExpanded = expanded[key]

          return (
            <div
              key={key}
              className="glass-panel hover:-translate-y-0.5 rounded-2xl border border-white/20 bg-white/18 hover:ring-white/60"
            >
              <button
                type="button"
                id={`${key}-trigger`}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate/80 focus-visible:focus-ring"
                onClick={() => toggleExpand(key)}
                aria-expanded={isExpanded}
                aria-controls={`${key}-panel`}
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-indigo/40 bg-indigo/20 px-3 py-1 text-xs font-semibold text-indigo">
                    {item.seed_phrase}
                  </span>
                  <span className="text-xs text-slate/60">{targetLabel}</span>
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-slate/50">
                  {indicesLabel}
                </span>
              </button>
              <div
                id={`${key}-panel`}
                role="region"
                aria-labelledby={`${key}-trigger`}
                className={`${isExpanded ? 'grid' : 'hidden'} gap-3 border-t border-white/15 px-4 py-3 text-sm text-slate/75`}
              >
                {item.why && (
                  <p className="font-mono text-xs text-slate/60">
                    Why: {item.why}
                  </p>
                )}
                <ul className="space-y-1 text-xs glass-body">
                  {item.influences.map((influence, index) => (
                    <li
                      key={`${key}-${influence.story}-${influence.sent_idx}-${index}`}
                    >
                      ↳{' '}
                      {influence.story === 'hopeful' ? 'Hopeful' : 'Cautionary'}{' '}
                      sentence s{influence.sent_idx}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EvidencePanel
