import { Link } from 'react-router-dom';
import heroTexture from '@assets/paper-texture.svg';
import { useStories } from '../lib/StoriesContext';
import { getSeedsCount, getStoriesCount, getTopThemes } from '../lib/metrics';

const Home = () => {
  const { stories, isLoading, error } = useStories();

  const seedsCount = getSeedsCount(stories);
  const storiesCount = getStoriesCount(stories);
  const topThemes = getTopThemes(stories);

  return (
    <section className="flex flex-col gap-12">
      <div
        className="relative overflow-hidden rounded-3xl bg-base-light p-8 shadow-artifact"
        style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover' }}
      >
        <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-sunrise/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-hope/30 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-600">Speculative futures lab</p>
          <h1 className="font-display text-4xl text-slate-900 sm:text-5xl">
            <span className="block">Tomorrow, In Two Voices</span>
          </h1>
          <p className="max-w-3xl text-lg text-slate-700">
            One seed, two futures. Explore how AI imagines 2050 through hopeful and cautionary retellings of citizen prompts.
          </p>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Primary actions">
            <Link
              to="/archive"
              className="rounded-full bg-focus px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-focus"
            >
              Enter the Archive
            </Link>
            <Link
              to="/submit"
              className="rounded-full border border-cyan px-5 py-2 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/10 focus:outline-none focus:ring-2 focus:ring-focus"
            >
              Submit a Seed
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="how-it-works" className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="how-it-works" className="font-display text-2xl text-slate-900">
            How it works
          </h2>
          <ol className="mt-4 space-y-4 text-slate-700">
            <li>
              <span className="font-semibold text-focus">Seed →</span> Community members submit provocations about daily life in 2050.
            </li>
            <li>
              <span className="font-semibold text-sunrise">Clean →</span> We remove personal details and sharpen the prompt.
            </li>
            <li>
              <span className="font-semibold text-hope">Generate →</span> Facilitators co-create hopeful and cautionary stories with Gemini.
            </li>
            <li>
              <span className="font-semibold text-caution">Publish →</span> Stories land here as auditable JSON artifacts you can trace.
            </li>
          </ol>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-artifact">
          <h2 className="font-display text-2xl text-slate-900">Quick stats</h2>
          {isLoading ? (
            <p className="mt-4 text-slate-600">Loading archive metrics…</p>
          ) : error ? (
            <p className="mt-4 text-caution">Unable to load stories: {error}</p>
          ) : (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-focus/10 p-4">
                <dt className="text-xs uppercase tracking-wide text-focus">Seeds</dt>
                <dd className="text-2xl font-semibold text-slate-900">{seedsCount}</dd>
              </div>
              <div className="rounded-2xl bg-hope/10 p-4">
                <dt className="text-xs uppercase tracking-wide text-hope">Stories</dt>
                <dd className="text-2xl font-semibold text-slate-900">{storiesCount}</dd>
              </div>
              <div className="rounded-2xl bg-sunrise/10 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-sunrise">Top themes</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {topThemes.length ? (
                    topThemes.map(({ theme, count }) => (
                      <span
                        key={theme}
                        className="rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-slate-700 shadow-sm"
                      >
                        {theme} <span className="text-xs text-slate-500">×{count}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Themes will appear as the archive grows.</span>
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
