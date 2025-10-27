import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Filters from '../components/Filters'
import StoryCard from '../components/Card'
import {
  applyArchiveFilters,
  collectFilterOptions,
  defaultArchiveFilters,
} from '../lib/filters'
import type { ArchiveFilters } from '../lib/filters'
import { useStories } from '../lib/StoriesContext'

const PAGE_SIZE = 10

const Archive = () => {
  const location = useLocation()
  const { stories, isLoading, error } = useStories()
  const [filters, setFilters] = useState<ArchiveFilters>({
    ...defaultArchiveFilters,
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const options = useMemo(() => collectFilterOptions(stories), [stories])
  const filteredStories = useMemo(
    () => applyArchiveFilters(stories, filters),
    [stories, filters],
  )
  const totalPages = Math.max(1, Math.ceil(filteredStories.length / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pageStart = (currentPage - 1) * PAGE_SIZE
  const visibleStories = filteredStories.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  )

  const paginationItems = useMemo(() => {
    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)
    for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
      if (i > 1 && i < totalPages) pages.add(i)
    }
    const sorted = Array.from(pages).sort((a, b) => a - b)
    const result: Array<number | 'ellipsis'> = []
    sorted.forEach((page, index) => {
      if (index === 0) {
        result.push(page)
        return
      }
      const prev = sorted[index - 1]
      if (page - prev > 1) {
        result.push('ellipsis')
      }
      result.push(page)
    })
    return result
  }, [currentPage, totalPages])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '')
      window.setTimeout(() => {
        const element = document.getElementById(elementId)
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [location.hash])

  return (
    <section
      data-section="archive"
      className="section-root flex min-h-screen flex-col gap-10 pb-24"
    >
      <header className="space-y-4">
        <h1 className="glass-heading text-4xl">2050 Futures Archive</h1>
        <p className="glass-body max-w-3xl text-lg">
          Each story begins with a seed: a glimpse of one person’s imagined 2050. <br />Watch how each seed branches into hopeful, balanced, and cautionary futures.
        </p>
      </header>

      <Filters
        filters={filters}
        options={options}
        onChange={setFilters}
        resultCount={filteredStories.length}
      />

      {isLoading && <p className="text-slate/80">Loading story artifacts…</p>}
      {error && <p className="text-rust">Could not load stories: {error}</p>}

      <div className="grid gap-10" aria-live="polite">
        {visibleStories.map((story) => (
          <StoryCard key={story.id} story={story} anchorId={story.id} />
        ))}
        {!visibleStories.length && !isLoading && !error && (
          <div className="glass-panel hover:-translate-y-0.5 rounded-3xl border border-white/20 bg-white/18 p-6">
            <div className="glass-scrim glass-body text-sm">
              No stories match the current filters. Try clearing selections or
              expanding your search.
            </div>
          </div>
        )}
      </div>

      {filteredStories.length > PAGE_SIZE && (
        <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Archive pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="rounded-full border border-white/25 bg-white/14 px-3 py-1 text-sm text-slate/75 transition hover:bg-white/24 focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {paginationItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate/60">
                …
              </span>
            ) : (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => setCurrentPage(item)}
                className={`rounded-full px-3 py-1 text-sm font-medium focus-visible:focus-ring ${
                  item === currentPage
                    ? 'bg-indigo-600 text-white shadow'
                    : 'border border-white/25 bg-white/14 text-slate/80 hover:bg-white/24'
                }`}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            className="rounded-full border border-white/25 bg-white/14 px-3 py-1 text-sm text-slate/75 transition hover:bg-white/24 focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  )
}

export default Archive
