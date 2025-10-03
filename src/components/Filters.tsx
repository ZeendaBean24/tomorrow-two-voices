import { useId } from 'react';
import { defaultArchiveFilters } from '../lib/filters';
import type { ArchiveFilters } from '../lib/filters';

type FilterOptions = {
  themes: string[];
  construal: string[];
  agency: string[];
  affect: string[];
  risk: string[];
  ageBand: string[];
};

type FiltersProps = {
  filters: ArchiveFilters;
  options: FilterOptions;
  onChange: (filters: ArchiveFilters) => void;
  resultCount: number;
};

const toggleTheme = (filters: ArchiveFilters, theme: string): ArchiveFilters => {
  const exists = filters.themes.includes(theme);
  return {
    ...filters,
    themes: exists ? filters.themes.filter((item) => item !== theme) : [...filters.themes, theme],
  };
};

const Filters = ({ filters, options, onChange, resultCount }: FiltersProps) => {
  const searchId = useId();

  const handleSingleSelect = (key: keyof ArchiveFilters, value?: string) => {
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value });
  };

  return (
    <div className="relative z-30">
      <div className="sticky top-24 space-y-4 md:top-28">
        <div className="glass-panel flex flex-wrap items-center gap-3 rounded-full border border-white/25 bg-white/20 px-5 py-4 text-sm text-slate/80 hover:-translate-y-0.5 hover:ring-indigo-500/30">
          <span className="rounded-full border border-indigo/40 bg-indigo/20 px-4 py-1 font-semibold text-indigo" aria-live="polite">
            {resultCount} result{resultCount === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            className="rounded-full bg-white/18 px-3 py-1 text-xs font-medium text-slate/70 backdrop-blur-md ring-1 ring-white/30 transition hover:bg-white/26 focus-visible:focus-ring"
            onClick={() => onChange({ ...defaultArchiveFilters })}
          >
            Clear all
          </button>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor={searchId} className="text-xs uppercase tracking-[0.25em] text-slate/60">
              Search
            </label>
            <input
              id={searchId}
              type="search"
              value={filters.search ?? ''}
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
              placeholder="Seed or story text"
              className="w-56 rounded-full bg-white/16 px-3 py-1 text-sm text-slate/80 backdrop-blur-md ring-1 ring-white/25 focus-visible:focus-ring"
            />
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-white/25 bg-white/18 p-4">
          <div className="space-y-4 text-xs text-slate/70">
            <fieldset>
              <legend className="mb-2 text-[11px] uppercase tracking-[0.3em] text-slate/50">Themes</legend>
              <div className="flex flex-wrap gap-2">
                {options.themes.map((theme) => {
                  const active = filters.themes.includes(theme);
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => onChange(toggleTheme(filters, theme))}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition focus-visible:focus-ring backdrop-blur-md ring-1 ${
                        active
                          ? 'bg-white/28 text-white shadow ring-indigo-500/30'
                          : 'bg-white/18 text-slate/80 hover:bg-white/24 ring-white/30'
                      }`}
                      aria-pressed={active}
                    >
                      {theme}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {([
              ['construal', options.construal],
              ['agency', options.agency],
              ['affect', options.affect],
              ['risk', options.risk],
              ['ageBand', options.ageBand],
            ] as const).map(([key, values]) => (
              <fieldset key={key}>
                <legend className="mb-2 text-[11px] uppercase tracking-[0.3em] text-slate/50">
                  {key === 'ageBand' ? 'Age band' : key.charAt(0).toUpperCase() + key.slice(1)}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const active = (filters[key] ?? '').toLowerCase() === value.toLowerCase();
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSingleSelect(key, value)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition focus-visible:focus-ring backdrop-blur-md ring-1 ${
                          active
                            ? 'bg-white/28 text-emerald-700/85 shadow ring-emerald/30'
                            : 'bg-white/18 text-slate/80 hover:bg-white/24 ring-white/30'
                        }`}
                        aria-pressed={active}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
