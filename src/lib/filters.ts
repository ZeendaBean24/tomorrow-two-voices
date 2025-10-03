import type { Story } from './types';

type MaybeString = string | null | undefined;

export type ArchiveFilters = {
  themes: string[];
  construal?: MaybeString;
  agency?: MaybeString;
  affect?: MaybeString;
  risk?: MaybeString;
  ageBand?: MaybeString;
  search?: MaybeString;
};

export const defaultArchiveFilters: ArchiveFilters = {
  themes: [],
  construal: undefined,
  agency: undefined,
  affect: undefined,
  risk: undefined,
  ageBand: undefined,
  search: '',
};

const matchesText = (story: Story, query?: MaybeString) => {
  const normalized = query?.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [story.seed.text, story.ai.hopeful, story.ai.cautionary]
    .join(' ')
    .toLowerCase();
  return haystack.includes(normalized);
};

const matchesThemes = (story: Story, selected: string[]) => {
  if (!selected.length) return true;
  return selected.every((theme) => story.tags.themes.includes(theme));
};

const matchesValue = (value: string, selected?: MaybeString) => {
  if (!selected) return true;
  return value.toLowerCase() === selected.toLowerCase();
};

export const applyArchiveFilters = (stories: Story[], filters: ArchiveFilters): Story[] =>
  stories.filter((story) =>
    matchesThemes(story, filters.themes) &&
    matchesValue(story.tags.construal, filters.construal) &&
    matchesValue(story.tags.agency, filters.agency) &&
    matchesValue(story.tags.affect, filters.affect) &&
    matchesValue(story.tags.risk, filters.risk) &&
    matchesValue(story.seed.age_band, filters.ageBand) &&
    matchesText(story, filters.search),
  );

export const collectFilterOptions = (stories: Story[]) => {
  const themeSet = new Set<string>();
  const construalSet = new Set<string>();
  const agencySet = new Set<string>();
  const affectSet = new Set<string>();
  const riskSet = new Set<string>();
  const ageBandSet = new Set<string>();

  stories.forEach((story) => {
    story.tags.themes.forEach((theme) => themeSet.add(theme));
    construalSet.add(story.tags.construal);
    agencySet.add(story.tags.agency);
    affectSet.add(story.tags.affect);
    riskSet.add(story.tags.risk);
    ageBandSet.add(story.seed.age_band);
  });

  const sortAlpha = (values: Iterable<string>) => Array.from(values).sort((a, b) => a.localeCompare(b));

  return {
    themes: sortAlpha(themeSet),
    construal: sortAlpha(construalSet),
    agency: sortAlpha(agencySet),
    affect: sortAlpha(affectSet),
    risk: sortAlpha(riskSet),
    ageBand: sortAlpha(ageBandSet),
  };
};

export const countFilteredStories = (stories: Story[], filters: ArchiveFilters) =>
  applyArchiveFilters(stories, filters).length;
