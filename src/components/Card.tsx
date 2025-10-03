import type { CSSProperties } from 'react';
import { useId, useMemo, useState } from 'react';
import EvidencePanel from './EvidencePanel';
import MetricsPanel from './Metrics';
import Tabs from './Tabs';
import { CogSciChip, MetaPill, ThemeChip } from './Chips';
import { splitSentences } from '../lib/sentenceSplit';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import type { Influence, Story } from '../lib/types';

const tabs = [
  { id: 'story', label: 'Narrative' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'metrics', label: 'Metrics' },
] as const;

type StoryPaneProps = {
  storyId: string;
  storyKey: 'hopeful' | 'cautionary';
  sentences: string[];
  highlightEnabled: boolean;
  activeHighlightKey: string | null;
  activeInfluences: Influence[];
  onSentenceFocus: (storyKey: 'hopeful' | 'cautionary', index: number) => void;
  onSentenceClear: (key: string) => void;
  className?: string;
  style?: CSSProperties;
  pointerActive?: boolean;
  ariaHidden?: boolean;
};

const StoryPane = ({
  storyId,
  storyKey,
  sentences,
  highlightEnabled,
  activeHighlightKey,
  activeInfluences,
  onSentenceFocus,
  onSentenceClear,
  className,
  style,
  pointerActive = true,
  ariaHidden,
}: StoryPaneProps) => (
  <div
    className={`space-y-4 ${className ?? ''}`}
    style={pointerActive ? style : { ...style, pointerEvents: 'none' }}
    aria-live="polite"
    aria-hidden={ariaHidden}
  >
    {sentences.map((sentence, index) => {
      const highlight =
        highlightEnabled && activeInfluences.some((influence) => influence.story === storyKey && influence.sent_idx === index);
      const highlightStyles = highlight
        ? storyKey === 'hopeful'
          ? 'border border-emerald/50 bg-emerald/10 ring-2 ring-emerald/25'
          : 'border border-rust/50 bg-rust/10 ring-2 ring-rust/25'
        : 'border border-slate/20 bg-paper/95';
      const sentenceKey = `${storyId}-${storyKey}-s${index}`;
      return (
        <div
          key={sentenceKey}
          className={`relative rounded-2xl p-4 text-left transition ${highlightStyles}`}
        >
          <button
            type="button"
            className={`absolute -left-3 top-3 rounded-full px-2 py-1 text-[11px] font-semibold text-slate/70 transition focus-visible:focus-ring ${
              highlight ? 'bg-indigo text-white shadow' : 'bg-paper/80 shadow-sm'
            }`}
            onMouseEnter={() => onSentenceFocus(storyKey, index)}
            onFocus={() => onSentenceFocus(storyKey, index)}
            onMouseLeave={() => onSentenceClear(sentenceKey)}
            onBlur={() => onSentenceClear(sentenceKey)}
            aria-pressed={highlight}
            aria-label={`${storyKey === 'hopeful' ? 'Hopeful' : 'Cautionary'} sentence ${index + 1}`}
          >
            [s{index}]
          </button>
          <p className="text-sm text-slate/85">{sentence}</p>
        </div>
      );
    })}
    {!sentences.length && <p className="text-sm text-slate/60">This story is awaiting transcription.</p>}
    {highlightEnabled && activeHighlightKey && (
      <p className="text-xs text-slate/60">
        Highlighting trace: {activeHighlightKey.replace(`${storyId}-`, '').replace(/-/g, ' ')}
      </p>
    )}
  </div>
);

type StoryCardProps = {
  story: Story;
  anchorId?: string;
};

const clampBlend = (value: number) => Math.min(1, Math.max(0, Number(value.toFixed(2))));

const StoryCard = ({ story, anchorId }: StoryCardProps) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('story');
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [activeHighlightKey, setActiveHighlightKey] = useState<string | null>(null);
  const [activeInfluences, setActiveInfluences] = useState<Influence[]>([]);
  const [copied, setCopied] = useState(false);
  const [blend, setBlend] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sliderId = useId();

  const hopefulSentences = useMemo(() => splitSentences(story.ai.hopeful), [story.ai.hopeful]);
  const cautionarySentences = useMemo(() => splitSentences(story.ai.cautionary), [story.ai.cautionary]);

  const influencesForSentence = (storyKey: 'hopeful' | 'cautionary', index: number) =>
    story.ai.evidence
      .flatMap((item) => item.influences.map((influence) => ({ ...influence, phrase: item.seed_phrase })))
      .filter((influence) => influence.story === storyKey && influence.sent_idx === index)
      .map(({ story: s, sent_idx }) => ({ story: s, sent_idx }));

  const handleSentenceFocus = (storyKey: 'hopeful' | 'cautionary', index: number) => {
    if (!highlightEnabled) return;
    const influences = influencesForSentence(storyKey, index);
    if (influences.length) {
      setActiveHighlightKey(`${story.id}-${storyKey}-s${index}`);
      setActiveInfluences(influences);
    }
  };

  const handleHighlightActivate = (key: string, influences: Influence[]) => {
    if (!highlightEnabled) return;
    setActiveHighlightKey(key);
    setActiveInfluences(influences);
  };

  const clearHighlight = () => {
    setActiveHighlightKey(null);
    setActiveInfluences([]);
  };

  const handleSentenceClear = (key: string) => {
    if (activeHighlightKey === key) {
      clearHighlight();
    }
  };

  const handleTabChange = (id: string) => {
    const allowedIds = tabs.map((tab) => tab.id);
    if (allowedIds.includes(id as (typeof tabs)[number]['id'])) {
      setActiveTab(id as (typeof tabs)[number]['id']);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (!navigator.clipboard) return;
      const url = new URL(window.location.href);
      url.hash = `#${anchorId ?? story.id}`;
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy link', error);
    }
  };

  const cardClasses = `group relative grid gap-6 rounded-3xl border border-slate/20 bg-paper/95 p-8 shadow-card ${
    prefersReducedMotion ? '' : 'transition duration-400 ease-out-quart hover:shadow-cardHover'
  }`;

  const effectiveBlend = prefersReducedMotion ? (blend >= 0.5 ? 1 : 0) : blend;
  const hopefulOpacity = 1 - effectiveBlend;
  const cautionaryOpacity = effectiveBlend;
  const sliderValue = blend;

  const handleSliderChange = (value: number) => {
    setBlend(clampBlend(value));
  };

  return (
    <article
      id={anchorId ?? story.id}
      className={cardClasses}
      style={{ backgroundImage: 'url(/assets/paper-texture.svg)' }}
      aria-label={`Story artifact ${story.id}`}
    >
      <div className={`grid gap-6 lg:grid-cols-[minmax(240px,1fr)_minmax(0,2fr)] ${
        prefersReducedMotion ? '' : 'transition-transform duration-400 ease-out-quart group-hover:-translate-y-1'
      }`}>
        <div className={`space-y-6 ${
          prefersReducedMotion ? '' : 'transform-gpu transition duration-400 ease-out-quart group-hover:-translate-y-1.5 group-hover:-translate-x-1'
        }`}>
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate/50">Raw seed</p>
            <h2 className="text-2xl text-slate">{story.seed.text}</h2>
          </header>
          <div className="space-y-3 text-xs text-slate/75">
            <div className="flex flex-wrap gap-2">
              <MetaPill label="ID" value={story.id} />
              <MetaPill
                label="Submitted"
                value={new Date(story.submitted_at).toLocaleDateString(undefined, {
                  month: 'short',
                  year: 'numeric',
                })}
              />
              <MetaPill label="Age" value={story.seed.age_band} />
            </div>
            <div className="flex flex-wrap gap-2">
              {story.tags.themes.map((theme) => (
                <ThemeChip key={theme} label={theme} tone="slate" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <CogSciChip type="construal" value={story.tags.construal} />
              <CogSciChip type="agency" value={story.tags.agency} />
              <CogSciChip type="affect" value={story.tags.affect} />
              <CogSciChip type="risk" value={story.tags.risk} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full border border-slate/25 px-3 py-1 font-medium text-slate/75 transition hover:bg-paper focus-visible:focus-ring"
            >
              {copied ? 'Link copied' : 'Copy link'}
            </button>
            <a
              href={`mailto:tomorrowvoices@example.com?subject=Removal request for ${story.id}`}
              className="rounded-full border border-oxblood/40 px-3 py-1 font-medium text-oxblood transition hover:bg-oxblood/10 focus-visible:focus-ring"
            >
              Report / Remove
            </a>
          </div>
        </div>

        <div className={`space-y-6 ${
          prefersReducedMotion ? '' : 'transform-gpu transition duration-400 ease-out-quart group-hover:-translate-y-2 group-hover:translate-x-1'
        }`}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
          <div
            id={`${activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={`${activeTab}-tab`}
            className="rounded-3xl border border-slate/20 bg-paper/95 p-5"
          >
            {activeTab === 'story' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <label
                    htmlFor={sliderId}
                    className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-slate/60"
                  >
                    <span>Hopeful</span>
                    <span>Cautionary</span>
                  </label>
                  <input
                    id={sliderId}
                    type="range"
                    role="slider"
                    min={0}
                    max={1}
                    step={0.05}
                    value={sliderValue}
                    aria-valuemin={0}
                    aria-valuemax={1}
                    aria-valuenow={Number(sliderValue.toFixed(2))}
                    aria-label="Blend hopeful and cautionary story"
                    className="h-[3px] w-full appearance-none rounded-full bg-slate/20 accent-indigo focus-visible:focus-ring"
                    onChange={(event) => handleSliderChange(Number(event.target.value))}
                  />
                </div>

                <div className="relative">
                  <StoryPane
                    storyId={story.id}
                    storyKey="hopeful"
                    sentences={hopefulSentences}
                    highlightEnabled={highlightEnabled}
                    activeHighlightKey={activeHighlightKey}
                    activeInfluences={activeInfluences}
                    onSentenceFocus={handleSentenceFocus}
                    onSentenceClear={handleSentenceClear}
                    className="transition-opacity duration-400 ease-out-quart"
                    style={{ opacity: hopefulOpacity }}
                    pointerActive={hopefulOpacity >= 0.4}
                    ariaHidden={cautionaryOpacity > 0.6}
                  />
                  <StoryPane
                    storyId={story.id}
                    storyKey="cautionary"
                    sentences={cautionarySentences}
                    highlightEnabled={highlightEnabled}
                    activeHighlightKey={activeHighlightKey}
                    activeInfluences={activeInfluences}
                    onSentenceFocus={handleSentenceFocus}
                    onSentenceClear={handleSentenceClear}
                    className="mask-wavy absolute inset-0 border-l border-rust/25 bg-rust/5 pl-6 transition-opacity duration-400 ease-out-quart"
                  style={{
                    opacity: cautionaryOpacity,
                    '--mask-position': `${Math.round(effectiveBlend * 100)}% 0`,
                    pointerEvents: cautionaryOpacity > 0.4 ? 'auto' : 'none',
                  } as CSSProperties}
                    pointerActive={cautionaryOpacity > 0.4}
                    ariaHidden={cautionaryOpacity <= 0.05}
                  />
                </div>
              </div>
            )}
            {activeTab === 'evidence' && (
              <EvidencePanel
                storyId={story.id}
                evidence={story.ai.evidence}
                highlightEnabled={highlightEnabled}
                activeHighlightKey={activeHighlightKey}
                activeInfluences={activeInfluences}
                onHighlightToggle={(enabled) => {
                  setHighlightEnabled(enabled);
                  if (!enabled) clearHighlight();
                }}
                onActivateHighlight={handleHighlightActivate}
                onClearHighlight={clearHighlight}
              />
            )}
            {activeTab === 'metrics' && <MetricsPanel story={story} />}
          </div>
          {activeTab !== 'evidence' && (
            <p className="text-xs text-slate/60">
              Tip: Switch to the Evidence tab to trace how the seed shapes each sentence.
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
