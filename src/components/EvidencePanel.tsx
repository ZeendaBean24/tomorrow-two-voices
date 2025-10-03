import { useMemo, useState } from 'react';
import type { Evidence, Influence } from '../lib/types';

const toKey = (storyId: string, phrase: string) => `${storyId}-${phrase.toLowerCase().replace(/\s+/g, '-')}`;

type EvidencePanelProps = {
  storyId: string;
  evidence: Evidence[];
  highlightEnabled: boolean;
  activeHighlightKey: string | null;
  activeInfluences: Influence[];
  onHighlightToggle: (enabled: boolean) => void;
  onActivateHighlight: (key: string, influences: Influence[]) => void;
  onClearHighlight: () => void;
};

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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const coverageCount = useMemo(
    () => evidence.reduce((count, item) => count + item.influences.length, 0),
    [evidence],
  );

  const toggleExpand = (key: string) => {
    setExpanded((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
        <span className="rounded-full bg-focus/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-focus">
          Trace coverage: {coverageCount}
        </span>
        <div className="flex flex-wrap gap-2" aria-label="Evidence legend">
          {evidence.map((item) => {
            const key = toKey(storyId, item.seed_phrase);
            const intersects = item.influences.some((influence) =>
              activeInfluences.some((active) => active.story === influence.story && active.sent_idx === influence.sent_idx),
            );
            const isActive = activeHighlightKey === key || intersects;
            return (
              <button
                key={key}
                type="button"
                className={`rounded-full px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-focus ${
                  isActive ? 'bg-focus text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onMouseEnter={() => onActivateHighlight(key, item.influences)}
                onFocus={() => onActivateHighlight(key, item.influences)}
                onMouseLeave={() => onClearHighlight()}
                onBlur={() => onClearHighlight()}
                onClick={() =>
                  isActive ? onClearHighlight() : onActivateHighlight(key, item.influences)
                }
                aria-pressed={isActive}
              >
                {item.seed_phrase}
              </button>
            );
          })}
        </div>
        <label className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Highlight influences in story</span>
          <button
            type="button"
            role="switch"
            aria-checked={highlightEnabled}
            onClick={() => onHighlightToggle(!highlightEnabled)}
            className={`h-7 w-12 rounded-full border transition ${
              highlightEnabled
                ? 'border-focus bg-focus/20'
                : 'border-slate-300 bg-white'
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-1 rounded-full bg-white shadow transition ${
                highlightEnabled ? 'translate-x-6 bg-focus' : 'bg-slate-300'
              }`}
            />
          </button>
        </label>
      </div>

      <div className="space-y-4">
        {evidence.map((item) => {
          const key = toKey(storyId, item.seed_phrase);
          const storyTargets = Array.from(new Set(item.influences.map((influence) => influence.story)));
          const targetLabel =
            storyTargets.length === 2
              ? 'Both stories'
              : storyTargets[0] === 'hopeful'
                ? 'Hopeful story'
                : 'Cautionary story';
          const indicesLabel = item.influences
            .map((influence) => `${influence.story === 'hopeful' ? 'H' : 'C'}:s${influence.sent_idx}`)
            .join(', ');
          const isExpanded = expanded[key];

          return (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white/90">
              <button
                type="button"
                id={`${key}-trigger`}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-focus"
                onClick={() => toggleExpand(key)}
                aria-expanded={isExpanded}
                aria-controls={`${key}-panel`}
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-focus/10 px-3 py-1 text-xs font-semibold text-focus">
                    {item.seed_phrase}
                  </span>
                  <span className="text-xs text-slate-500">{targetLabel}</span>
                </span>
                <span className="text-xs uppercase tracking-wide text-slate-400">{indicesLabel}</span>
              </button>
              <div
                id={`${key}-panel`}
                role="region"
                aria-labelledby={`${key}-trigger`}
                className={`${isExpanded ? 'grid' : 'hidden'} gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600`}
              >
                {item.why && <p className="font-mono text-xs text-slate-500">Why: {item.why}</p>}
                <ul className="space-y-1 text-xs text-slate-500">
                  {item.influences.map((influence, index) => (
                    <li key={`${key}-${influence.story}-${influence.sent_idx}-${index}`}>
                      ↳ {influence.story === 'hopeful' ? 'Hopeful' : 'Cautionary'} sentence s
                      {influence.sent_idx}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidencePanel;
