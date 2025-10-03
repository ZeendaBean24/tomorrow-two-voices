import { useMemo, useState } from 'react';
import EvidencePanel from './EvidencePanel';
import MetricsPanel from './Metrics';
import Tabs from './Tabs';
import { CogSciChip, MetaPill, ThemeChip } from './Chips';
import { splitSentences } from '../lib/sentenceSplit';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import type { Influence, Story } from '../lib/types';

const tabs = [
  { id: 'hopeful', label: 'Hopeful' },
  { id: 'cautionary', label: 'Cautionary' },
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
}: StoryPaneProps) => (
  <div className="space-y-4" aria-live="polite">
    {sentences.map((sentence, index) => {
      const highlight =
        highlightEnabled && activeInfluences.some((influence) => influence.story === storyKey && influence.sent_idx === index);
      const highlightStyles = highlight
        ? storyKey === 'hopeful'
          ? 'border border-hope/60 bg-hope/10 ring-2 ring-hope/40'
          : 'border border-caution/60 bg-caution/10 ring-2 ring-caution/30'
        : 'border border-slate-200 bg-white/80';
      const sentenceKey = `${storyId}-${storyKey}-s${index}`;
      return (
        <div
          key={sentenceKey}
          className={`relative rounded-2xl p-4 transition ${highlightStyles}`}
        >
          <button
            type="button"
            className={`absolute -left-3 top-3 rounded-full px-2 py-1 text-[11px] font-semibold text-slate-500 focus:outline-none focus:ring-2 focus:ring-focus ${
              highlight ? 'bg-focus text-white' : 'bg-slate-200'
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
          <p className="text-sm text-slate-700">{sentence}</p>
        </div>
      );
    })}
    {!sentences.length && <p className="text-sm text-slate-500">This story is awaiting transcription.</p>}
    {highlightEnabled && activeHighlightKey && (
      <p className="text-xs text-slate-500">
        Highlighting trace: {activeHighlightKey.replace(`${storyId}-`, '').replace(/-/g, ' ')}
      </p>
    )}
  </div>
);

type StoryCardProps = {
  story: Story;
  anchorId?: string;
};

const StoryCard = ({ story, anchorId }: StoryCardProps) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('hopeful');
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [activeHighlightKey, setActiveHighlightKey] = useState<string | null>(null);
  const [activeInfluences, setActiveInfluences] = useState<Influence[]>([]);
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

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

  const cardClasses = `group relative grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-artifact ${
    prefersReducedMotion ? '' : 'transition hover:shadow-artifactHover'
  }`;

  return (
    <article
      id={anchorId ?? story.id}
      className={cardClasses}
      style={{ backgroundImage: 'url(/assets/paper-texture.svg)' }}
      aria-label={`Story artifact ${story.id}`}
    >
      <div className={`grid gap-6 lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] ${
        prefersReducedMotion ? '' : 'transition-transform group-hover:-translate-y-0.5'
      }`}>
        <div className={`space-y-4 ${prefersReducedMotion ? '' : 'transform-gpu transition duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1'}`}>
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Raw seed</p>
            <h2 className="font-display text-2xl text-slate-900">{story.seed.text}</h2>
          </header>
          <div className="space-y-3 text-xs text-slate-600">
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
              className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-focus"
            >
              {copied ? 'Link copied' : 'Copy link'}
            </button>
            <a
              href={`mailto:tomorrowvoices@example.com?subject=Removal request for ${story.id}`}
              className="rounded-full border border-caution/50 px-3 py-1 font-medium text-caution hover:bg-caution/10 focus:outline-none focus:ring-2 focus:ring-focus"
            >
              Report / Remove
            </a>
          </div>
        </div>

        <div className={`space-y-5 ${prefersReducedMotion ? '' : 'transform-gpu transition duration-300 group-hover:-translate-y-1.5 group-hover:translate-x-1'}`}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div
            id={`${activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={`${activeTab}-tab`}
            className="rounded-3xl border border-slate-200 bg-white/80 p-5"
          >
            {activeTab === 'hopeful' && (
              <StoryPane
                storyId={story.id}
                storyKey="hopeful"
                sentences={hopefulSentences}
                highlightEnabled={highlightEnabled}
                activeHighlightKey={activeHighlightKey}
                activeInfluences={activeInfluences}
                onSentenceFocus={handleSentenceFocus}
                onSentenceClear={handleSentenceClear}
              />
            )}
            {activeTab === 'cautionary' && (
              <StoryPane
                storyId={story.id}
                storyKey="cautionary"
                sentences={cautionarySentences}
                highlightEnabled={highlightEnabled}
                activeHighlightKey={activeHighlightKey}
                activeInfluences={activeInfluences}
                onSentenceFocus={handleSentenceFocus}
                onSentenceClear={handleSentenceClear}
              />
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
            <p className="text-xs text-slate-500">
              Tip: Switch to the Evidence tab to trace how the seed shapes each sentence.
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
