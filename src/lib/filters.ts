import type { Story } from './types'

type MaybeString = string | null | undefined

export type ArchiveFilters = {
  themes: string[]
  agency?: MaybeString
  ageBand?: MaybeString
  language?: MaybeString
  search?: MaybeString
}

export const defaultArchiveFilters: ArchiveFilters = {
  themes: [],
  agency: undefined,
  ageBand: undefined,
  language: undefined,
  search: '',
}

const matchesThemes = (story: Story, selected: string[]) => {
  if (!selected.length) return true
  return selected.every((theme) => story.seed.themes.includes(theme))
}

const matchesValue = (value: string, selected?: MaybeString) => {
  if (!selected) return true
  return value.toLowerCase() === selected.toLowerCase()
}

const matchesSearch = (story: Story, query?: MaybeString) => {
  const normalized = query?.trim().toLowerCase()
  if (!normalized) return true
  const seedParts = [
    story.seed.hope,
    story.seed.worry,
    story.seed.ai_future,
    story.seed.technology,
    story.seed.object,
    story.seed.place,
    story.seed.time,
    story.seed.person_or_role,
    story.seed.value,
    story.seed.sensory_detail,
    story.seed.central_actor,
    story.seed.age_band,
    story.seed.language,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  const storyTexts = Object.values(story.ai)
    .map((variant) => variant?.text ?? '')
    .join(' ')
    .toLowerCase()
  return seedParts.includes(normalized) || storyTexts.includes(normalized)
}

export const applyArchiveFilters = (
  stories: Story[],
  filters: ArchiveFilters,
): Story[] =>
  stories.filter(
    (story) =>
      matchesThemes(story, filters.themes) &&
      matchesValue(story.seed.central_actor, filters.agency) &&
      matchesValue(story.seed.age_band, filters.ageBand) &&
      matchesValue(story.seed.language, filters.language) &&
      matchesSearch(story, filters.search),
  )

export const collectFilterOptions = (stories: Story[]) => {
  const themeSet = new Set<string>()
  const agencySet = new Set<string>()
  const ageBandSet = new Set<string>()
  const languageSet = new Set<string>()

  stories.forEach((story) => {
    story.seed.themes.forEach((theme) => themeSet.add(theme))
    agencySet.add(story.seed.central_actor)
    ageBandSet.add(story.seed.age_band)
    languageSet.add(story.seed.language)
  })

  const sortAlpha = (values: Iterable<string>) =>
    Array.from(values).sort((a, b) => a.localeCompare(b))

  return {
    themes: sortAlpha(themeSet),
    agency: sortAlpha(agencySet),
    ageBand: sortAlpha(ageBandSet),
    language: sortAlpha(languageSet),
  }
}

export const countFilteredStories = (
  stories: Story[],
  filters: ArchiveFilters,
) => applyArchiveFilters(stories, filters).length
