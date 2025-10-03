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
    <section className="sticky top-20 z-30 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="rounded-full bg-focus/10 px-3 py-1 font-semibold text-focus" aria-live="polite">
          {resultCount} result{resultCount === 1 ? '' : 's'}
        </span>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-focus"
          onClick={() => onChange({ ...defaultArchiveFilters })}
        >
          Clear all
        </button>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor={searchId} className="text-xs uppercase tracking-wide text-slate-500">
            Search
          </label>
          <input
            id={searchId}
            type="search"
            value={filters.search ?? ''}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Seed or story text"
            className="w-56 rounded-full border border-slate-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>
      </div>

      <div className="mt-4 space-y-4 text-xs text-slate-600">
        <fieldset>
          <legend className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">Themes</legend>
          <div className="flex flex-wrap gap-2">
            {options.themes.map((theme) => {
              const active = filters.themes.includes(theme);
              return (
                <button
                  key={theme}
                  type="button"
                  onClick={() => onChange(toggleTheme(filters, theme))}
                  className={`rounded-full px-3 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-focus ${
                    active ? 'bg-focus text-white shadow' : 'border border-slate-300 bg-white hover:bg-slate-100'
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
            <legend className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
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
                    className={`rounded-full px-3 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-focus ${
                      active ? 'bg-hope/20 text-hope shadow' : 'border border-slate-300 bg-white hover:bg-slate-100'
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
    </section>
  );
};

export default Filters;
