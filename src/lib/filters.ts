import type { Story } from './types'

type MaybeString = string | null | undefined

export type ArchiveFilters = {
  themes: string[]
  agency?: MaybeString
  ageBand?: MaybeString
  language?: MaybeString
}

export const defaultArchiveFilters: ArchiveFilters = {
  themes: [],
  agency: undefined,
  ageBand: undefined,
  language: undefined,
}

const matchesThemes = (story: Story, selected: string[]) => {
  if (!selected.length) return true
  return selected.every((theme) => story.seed.themes.includes(theme))
}

const matchesValue = (value: string, selected?: MaybeString) => {
  if (!selected) return true
  return value.toLowerCase() === selected.toLowerCase()
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
      matchesValue(story.seed.language, filters.language),
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
