import type { PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroTexture from '@assets/paper-texture.svg';
import { useStories } from '../lib/StoriesContext';
import { getSeedsCount, getStoriesCount } from '../lib/metrics';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import { useTilt } from '../lib/useTilt';
import HomeParallax from '../components/HomeParallax';

const TITLE = 'Tomorrow, In Two Voices';

const TypewriterTitle = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? TITLE : '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(TITLE);
      setIsDeleting(false);
    } else {
      setDisplayed('');
      setIsDeleting(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting && displayed.length < TITLE.length) {
      timeout = window.setTimeout(() => {
        setDisplayed(TITLE.slice(0, displayed.length + 1));
      }, 80);
    } else if (!isDeleting && displayed.length === TITLE.length) {
      timeout = window.setTimeout(() => {
        setIsDeleting(true);
      }, 5000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = window.setTimeout(() => {
        setDisplayed(TITLE.slice(0, displayed.length - 1));
      }, 45);
    } else if (isDeleting && displayed.length === 0) {
      timeout = window.setTimeout(() => {
        setIsDeleting(false);
      }, 1200);
    }

    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [displayed, isDeleting, prefersReducedMotion]);

  return (
    <span className={!prefersReducedMotion ? 'type-caret' : ''}>{displayed}</span>
  );
};

const Home = () => {
  const { stories, isLoading, error } = useStories();
  const heroTiltRef = useTilt({ maxDeg: 6, baseShadow: '0.12', activeShadow: '0.28' });

  const seedsCount = getSeedsCount(stories);
  const storiesCount = getStoriesCount(stories);
  const updateSpotlight = (event: ReactPointerEvent<HTMLElement>) => {
    const { currentTarget } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    currentTarget.style.setProperty('--hero-spot-x', `${x.toFixed(1)}%`);
    currentTarget.style.setProperty('--hero-spot-y', `${y.toFixed(1)}%`);
  };

  const resetSpotlight = (event: ReactPointerEvent<HTMLElement>, x = '50%', y = '35%') => {
    const { currentTarget } = event;
    currentTarget.style.setProperty('--hero-spot-x', x);
    currentTarget.style.setProperty('--hero-spot-y', y);
  };

  const workflow = [
    {
      title: 'Seed',
      description: 'Community prompts sketch daily life in 2050.',
    },
    {
      title: 'Clean',
      description: 'Facilitators anonymise, clarify, and frame each seed.',
    },
    {
      title: 'Generate',
      description: 'Paired hopeful and cautionary stories co-authored with Gemini.',
    },
    {
      title: 'Publish',
      description: 'Stories land here as auditable artefacts for the archive.',
    },
  ];

  const stats = [
    { label: 'Seeds', value: seedsCount.toLocaleString('en-US') },
    { label: 'Stories', value: storiesCount.toLocaleString('en-US') },
    { label: 'Letters processed', value: '48,205' },
    { label: 'Words processed', value: '128,940' },
    { label: 'Sentences processed', value: '7,320' },
  ];

  return (
    <section
      data-section="home"
      className="section-root relative flex min-h-screen flex-col gap-16 pb-24"
    >
      <HomeParallax />
      <div className="relative z-50 flex flex-col gap-16">
        <div
          ref={heroTiltRef}
          className="tilt-layer hero-ink-panel glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-white/60 relative overflow-hidden rounded-3xl p-10"
          onPointerMove={updateSpotlight}
          onPointerLeave={(event) => resetSpotlight(event, '50%', '35%')}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_60%),url(/assets/paper-texture.svg)]"
            aria-hidden="true"
          />
          <div className="glass-scrim relative flex flex-col gap-6">
            <p className="glass-text hero-ink-muted text-sm uppercase tracking-[0.35em]">
              Speculative futures lab
            </p>
            <h1 className="glass-heading hero-ink-heading text-4xl leading-tight tracking-tight sm:text-5xl">
              <TypewriterTitle />
            </h1>
            <p className="glass-body hero-ink-body max-w-2xl text-lg">
              One seed, two futures. Explore how AI imagines 2050 through hopeful and cautionary retellings of citizen prompts.
            </p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Primary actions">
              <Link
                to="/archive"
                className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:bg-indigo-700 focus-visible:focus-ring"
              >
                Enter the Archive
              </Link>
              <Link
                to="/submit"
                className="rounded-full border border-white/30 bg-white/20 px-6 py-2 text-sm font-semibold text-slate/85 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/28 focus-visible:focus-ring"
              >
                Submit a Seed
              </Link>
            </div>
          </div>
        </div>

        <section aria-labelledby="metrics" className="flex flex-col gap-16">
          <div
            className="hero-ink-panel hero-glass-pane hero-metrics-panel relative overflow-hidden rounded-3xl p-10"
            onPointerMove={updateSpotlight}
            onPointerLeave={(event) => resetSpotlight(event, '50%', '48%')}
          >
            <header className="hero-metrics-header">
              <h2 id="metrics" className="hero-ink-heading hero-metrics-title">
                Quick stats
              </h2>
              <p className="hero-ink-muted hero-metrics-summary">A snapshot of the archive in motion.</p>
            </header>
            {!isLoading && !error && (
              <dl className="hero-metrics-grid">
                {stats.map(({ label, value }) => (
                  <div key={label} className="hero-stat-tile">
                    <dt className="hero-ink-muted hero-stat-label">{label}</dt>
                    <dd className="hero-ink-heading hero-stat-value">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {isLoading && <p className="hero-ink-body hero-stat-loading">Loading archive metrics…</p>}
            {error && !isLoading && <p className="hero-ink-body hero-stat-error">Unable to load stories: {error}</p>}
          </div>

          <div
            className="tilt-layer hero-ink-panel glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-white/60 relative overflow-hidden rounded-3xl p-10 mx-auto w-full max-w-[640px]"
            onPointerMove={updateSpotlight}
            onPointerLeave={(event) => resetSpotlight(event, '52%', '44%')}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_60%),url(/assets/paper-texture.svg)]"
              aria-hidden="true"
            />
            <div className="glass-scrim relative flex flex-col items-center text-center gap-3">
              <h2 className="glass-heading hero-ink-heading hero-workflow-title">How does it work?</h2>
              <p className="glass-body hero-ink-body hero-workflow-subtitle">
                Four touchpoints that carry every seed from spark to story.
              </p>
            </div>
          </div>
          <ol className="hero-workflow-list">
            {workflow.map(({ title, description }, index) => (
              <li
                key={title}
                className="hero-ink-panel hero-glass-pane-lite hero-workflow-card"
                style={{ animationDelay: `${index * 0.12}s` }}
                onPointerMove={updateSpotlight}
                onPointerLeave={(event) => resetSpotlight(event, '50%', '45%')}
              >
                <div className="hero-workflow-card-inner">
                  <p className="hero-ink-heading hero-workflow-step">0{index + 1}</p>
                  <div className="hero-workflow-card-copy">
                    <p className="hero-ink-heading hero-workflow-card-title">{title}</p>
                    <p className="hero-ink-body hero-workflow-card-description">{description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
};

export default Home;
