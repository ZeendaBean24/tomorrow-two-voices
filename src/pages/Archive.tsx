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
    <section data-section="archive" className="section-root flex min-h-screen flex-col gap-10 pb-24">
      <header className="space-y-4">
        <h1 className="text-4xl text-slate">Archive of two-voice futures</h1>
        <p className="max-w-3xl text-lg text-slate/80">
          Filter by themes, cognition markers, and demographics to study how a single seed branches into contrasting possibilities.
        </p>
      </header>

      <Filters filters={filters} options={options} onChange={setFilters} resultCount={filteredStories.length} />

      {isLoading && <p className="text-slate/80">Loading story artifacts…</p>}
      {error && <p className="text-rust">Could not load stories: {error}</p>}

      <div className="grid gap-10" aria-live="polite">
        {visibleStories.map((story) => (
          <StoryCard key={story.id} story={story} anchorId={story.id} />
        ))}
        {!visibleStories.length && !isLoading && !error && (
          <p className="rounded-3xl border border-slate/20 bg-paper/90 p-6 text-sm text-slate/80 shadow-card">
            No stories match the current filters. Try clearing selections or expanding your search.
          </p>
        )}
      </div>

      {visibleCount < filteredStories.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full bg-indigo px-7 py-2 text-sm font-semibold text-white shadow transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:focus-ring"
          >
            Load more stories
          </button>
        </div>
      )}
    </section>
  );
};

export default Archive;
