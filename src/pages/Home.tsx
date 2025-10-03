import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroTexture from '@assets/paper-texture.svg';
import { useStories } from '../lib/StoriesContext';
import { getSeedsCount, getStoriesCount, getTopThemes } from '../lib/metrics';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';

const TITLE = 'Tomorrow, In Two Voices';

const TypewriterTitle = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? TITLE : '');

  useEffect(() => {
    if (prefersReducedMotion) return;
    let frame = 0;
    let handle = 0;

    const reveal = () => {
      frame += 1;
      setDisplayed(TITLE.slice(0, frame));
      if (frame < TITLE.length) {
        handle = window.setTimeout(reveal, 80);
      }
    };

    handle = window.setTimeout(reveal, 120);
    return () => window.clearTimeout(handle);
  }, [prefersReducedMotion]);

  return (
    <span className={!prefersReducedMotion ? 'type-caret' : ''}>{displayed}</span>
  );
};

const Home = () => {
  const { stories, isLoading, error } = useStories();

  const seedsCount = getSeedsCount(stories);
  const storiesCount = getStoriesCount(stories);
  const topThemes = getTopThemes(stories);

  return (
    <section
      data-section="home"
      className="section-root flex min-h-screen flex-col gap-16 pb-24"
    >
      <div className="relative overflow-hidden rounded-3xl border border-slate/20 bg-paper p-10 shadow-card backdrop-blur">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_60%),url(/assets/paper-texture.svg)]"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate/70">Speculative futures lab</p>
          <h1 className="text-4xl leading-tight text-slate sm:text-5xl">
            <TypewriterTitle />
          </h1>
          <p className="max-w-2xl text-lg text-slate/80">
            One seed, two futures. Explore how AI imagines 2050 through hopeful and cautionary retellings of citizen prompts.
          </p>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Primary actions">
            <Link
              to="/archive"
              className="rounded-full bg-indigo px-6 py-2 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:focus-ring"
            >
              Enter the Archive
            </Link>
            <Link
              to="/submit"
              className="rounded-full border border-cyan/60 px-6 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/10 focus-visible:focus-ring"
            >
              Submit a Seed
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="how-it-works" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate/20 bg-paper p-8 shadow-card">
          <h2 id="how-it-works" className="text-3xl text-slate">
            How it works
          </h2>
          <ol className="mt-6 space-y-5 text-base text-slate/80">
            <li>
              <span className="font-semibold text-emerald">Seed →</span> Community members submit provocations about daily life in 2050.
            </li>
            <li>
              <span className="font-semibold text-gold">Clean →</span> We remove personal details and sharpen the prompt.
            </li>
            <li>
              <span className="font-semibold text-emerald">Generate →</span> Facilitators co-create hopeful and cautionary stories with Gemini.
            </li>
            <li>
              <span className="font-semibold text-rust">Publish →</span> Stories land here as auditable JSON artifacts you can trace.
            </li>
          </ol>
        </div>
        <div className="rounded-3xl border border-slate/20 bg-paper p-8 shadow-card">
          <h2 className="text-3xl text-slate">Quick stats</h2>
          {isLoading ? (
            <p className="mt-4 text-slate/70">Loading archive metrics…</p>
          ) : error ? (
            <p className="mt-4 text-rust">Unable to load stories: {error}</p>
          ) : (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald/20 bg-emerald/10 p-4">
                <dt className="text-xs uppercase tracking-wide text-emerald">Seeds</dt>
                <dd className="text-3xl font-semibold text-slate">{seedsCount}</dd>
              </div>
              <div className="rounded-2xl border border-indigo/20 bg-indigo/10 p-4">
                <dt className="text-xs uppercase tracking-wide text-indigo">Stories</dt>
                <dd className="text-3xl font-semibold text-slate">{storiesCount}</dd>
              </div>
              <div className="sm:col-span-2 rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <dt className="text-xs uppercase tracking-wide text-gold">Top themes</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {topThemes.length ? (
                    topThemes.map(({ theme, count }) => (
                      <span
                        key={theme}
                        className="rounded-full border border-paper/40 bg-paper/80 px-3 py-1 text-sm font-medium text-slate shadow"
                      >
                        {theme} <span className="text-xs text-slate/70">×{count}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate/70">Themes will appear as the archive grows.</span>
                  )}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </section>
    </section>
  );
};

export default Home;
