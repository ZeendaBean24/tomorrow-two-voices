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
          className="tilt-layer glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-indigo-500/30 relative overflow-hidden rounded-3xl p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_60%),url(/assets/paper-texture.svg)]"
            aria-hidden="true"
          />
          <div className="glass-scrim relative flex flex-col gap-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate/75">Speculative futures lab</p>
            <h1 className="glass-heading text-4xl leading-tight sm:text-5xl">
              <TypewriterTitle />
            </h1>
            <p className="glass-body max-w-2xl text-lg">
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
          <div className="glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-indigo-500/30 rounded-3xl p-8 glass-border-indigo">
            <div className="glass-scrim space-y-5">
              <h2 id="how-it-works" className="glass-heading text-3xl">
                How it works
              </h2>
              <ol className="space-y-5 text-base text-slate/85">
                <li>
                  <span className="font-semibold text-emerald-700/85">Seed →</span> Community members submit provocations about daily life in 2050.
                </li>
                <li>
                  <span className="font-semibold text-gold-600/85">Clean →</span> We remove personal details and sharpen the prompt.
                </li>
                <li>
                  <span className="font-semibold text-emerald-700/85">Generate →</span> Facilitators co-create hopeful and cautionary stories with Gemini.
                </li>
                <li>
                  <span className="font-semibold text-rust-600/85">Publish →</span> Stories land here as auditable JSON artifacts you can trace.
                </li>
              </ol>
            </div>
          </div>
          <div className="glass-panel hover:-translate-y-0.5 hover:bg-white/28 hover:backdrop-blur-lg hover:ring-indigo-500/30 rounded-3xl p-8 glass-border-gold">
            <div className="glass-scrim space-y-5">
              <h2 className="glass-heading text-3xl">Quick stats</h2>
              {isLoading ? (
                <p className="glass-body">Loading archive metrics…</p>
              ) : error ? (
                <p className="glass-body text-rust-600/85">Unable to load stories: {error}</p>
              ) : (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald/35 bg-white/18 p-4 backdrop-blur-md shadow">
                    <dt className="text-xs uppercase tracking-wide text-emerald-700/85">Seeds</dt>
                    <dd className="glass-heading text-3xl">{seedsCount}</dd>
                  </div>
                  <div className="rounded-2xl border border-indigo/35 bg-white/18 p-4 backdrop-blur-md shadow">
                    <dt className="text-xs uppercase tracking-wide text-indigo-600/85">Stories</dt>
                    <dd className="glass-heading text-3xl">{storiesCount}</dd>
                  </div>
                  <div className="sm:col-span-2 rounded-2xl border border-gold/30 bg-white/18 p-4 backdrop-blur-md shadow">
                    <dt className="text-xs uppercase tracking-wide text-gold-600/85">Top themes</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {topThemes.length ? (
                        topThemes.map(({ theme, count }) => (
                          <span
                            key={theme}
                            className="rounded-full border border-white/30 bg-white/22 px-3 py-1 text-sm font-medium text-slate/85 backdrop-blur"
                          >
                            {theme} <span className="text-xs text-slate/70">×{count}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate/75">Themes will appear as the archive grows.</span>
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
