import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroTexture from '@assets/paper-texture.svg';
import { useStories } from '../lib/StoriesContext';
import { getSeedsCount, getStoriesCount, getTopThemes } from '../lib/metrics';
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
  const topThemes = getTopThemes(stories);

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
          onPointerMove={(event) => {
            const { currentTarget } = event;
            const rect = currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            currentTarget.style.setProperty('--hero-spot-x', `${x.toFixed(1)}%`);
            currentTarget.style.setProperty('--hero-spot-y', `${y.toFixed(1)}%`);
          }}
          onPointerLeave={(event) => {
            const { currentTarget } = event;
            currentTarget.style.setProperty('--hero-spot-x', '50%');
            currentTarget.style.setProperty('--hero-spot-y', '35%');
          }}
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

        <section aria-labelledby="how-it-works" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-white/60 rounded-3xl p-8 ring-0">
            <div className="glass-scrim space-y-5">
              <h2 id="how-it-works" className="glass-glow-heading text-3xl tracking-tight">
                How it works
              </h2>
              <ol className="glass-glow-body space-y-5 text-base">
                <li>
                  <span className="glass-glow-accent font-semibold text-emerald-300/90">Seed →</span> Community members submit provocations about daily life in 2050.
                </li>
                <li>
                  <span className="glass-glow-accent font-semibold text-gold-300/90">Clean →</span> We remove personal details and sharpen the prompt.
                </li>
                <li>
                  <span className="glass-glow-accent font-semibold text-emerald-300/90">Generate →</span> Facilitators co-create hopeful and cautionary stories with Gemini.
                </li>
                <li>
                  <span className="glass-glow-accent font-semibold text-rust-300/90">Publish →</span> Stories land here as auditable JSON artifacts you can trace.
                </li>
              </ol>
            </div>
          </div>
          <div className="glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-white/60 rounded-3xl p-8 ring-0">
            <div className="glass-scrim space-y-5">
              <h2 className="glass-glow-heading text-3xl tracking-tight">Quick stats</h2>
              {isLoading ? (
                <p className="glass-glow-body">Loading archive metrics…</p>
              ) : error ? (
                <p className="glass-glow-body">Unable to load stories: {error}</p>
              ) : (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald/35 bg-white/18 p-4 backdrop-blur-md shadow">
                    <dt className="glass-glow-heading text-sm font-semibold uppercase tracking-[0.35em]">Seeds</dt>
                    <dd className="glass-glow-heading text-3xl tracking-tight">{seedsCount}</dd>
                  </div>
                  <div className="rounded-2xl border border-indigo/35 bg-white/18 p-4 backdrop-blur-md shadow">
                    <dt className="glass-glow-heading text-sm font-semibold uppercase tracking-[0.35em]">Stories</dt>
                    <dd className="glass-glow-heading text-3xl tracking-tight">{storiesCount}</dd>
                  </div>
                  <div className="sm:col-span-2 rounded-2xl border border-gold/30 bg-white/18 p-4 backdrop-blur-md shadow">
                    <dt className="glass-glow-heading text-sm font-semibold uppercase tracking-[0.35em]">Top themes</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {topThemes.length ? (
                        topThemes.map(({ theme, count }) => (
                          <span
                            key={theme}
                            className="glass-glow-body rounded-full border border-white/30 bg-white/22 px-3 py-1 text-sm font-medium backdrop-blur"
                          >
                            {theme}{' '}
                            <span className="glass-glow-muted text-xs">×{count}</span>
                          </span>
                        ))
                      ) : (
                        <span className="glass-glow-muted text-sm">Themes will appear as the archive grows.</span>
                      )}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Home;
