import type { Story, ThemeFrequency } from './types'

export const getSeedsCount = (stories: Story[]): number => stories.length

export const getStoriesCount = (stories: Story[]): number => stories.length * 3

export const getTopThemes = (stories: Story[], limit = 3): ThemeFrequency[] => {
  const counts = new Map<string, number>()
  stories.forEach((story) => {
    story.seed.themes.forEach((theme) => {
      counts.set(theme, (counts.get(theme) ?? 0) + 1)
    })
  })

  return Array.from(counts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
