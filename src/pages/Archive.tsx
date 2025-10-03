import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Filters from '../components/Filters';
import StoryCard from '../components/Card';
import { applyArchiveFilters, collectFilterOptions, defaultArchiveFilters } from '../lib/filters';
import type { ArchiveFilters } from '../lib/filters';
import { useStories } from '../lib/StoriesContext';

const PAGE_SIZE = 6;

const Archive = () => {
  const location = useLocation();
  const { stories, isLoading, error } = useStories();
  const [filters, setFilters] = useState<ArchiveFilters>({ ...defaultArchiveFilters });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const options = useMemo(() => collectFilterOptions(stories), [stories]);
  const filteredStories = useMemo(() => applyArchiveFilters(stories, filters), [stories, filters]);
  const visibleStories = filteredStories.slice(0, visibleCount);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      window.setTimeout(() => {
        const element = document.getElementById(elementId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [location.hash]);

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="font-display text-3xl text-slate-900">Archive of two-voice futures</h1>
        <p className="text-lg text-slate-700">
          Filter by themes, cognition markers, and demographics to study how a single seed branches into contrasting possibilities.
        </p>
      </header>

      <Filters filters={filters} options={options} onChange={setFilters} resultCount={filteredStories.length} />

      {isLoading && <p className="text-slate-600">Loading story artifacts…</p>}
      {error && <p className="text-caution">Could not load stories: {error}</p>}

      <div className="grid gap-8" aria-live="polite">
        {visibleStories.map((story) => (
          <StoryCard key={story.id} story={story} anchorId={story.id} />
        ))}
        {!visibleStories.length && !isLoading && !error && (
          <p className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600">
            No stories match the current filters. Try clearing selections or expanding your search.
          </p>
        )}
      </div>

      {visibleCount < filteredStories.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full bg-focus px-6 py-2 text-sm font-semibold text-white shadow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-focus"
          >
            Load more stories
          </button>
        </div>
      )}
    </section>
  );
};

export default Archive;
