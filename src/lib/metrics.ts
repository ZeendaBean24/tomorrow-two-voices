import type { Story, ThemeFrequency } from './types'

export const getSeedsCount = (stories: Story[]): number => stories.length

export const getStoriesCount = (stories: Story[]): number => stories.length * 2

export const getTopThemes = (stories: Story[], limit = 3): ThemeFrequency[] => {
  const counts = new Map<string, number>()
  stories.forEach((story) => {
    story.tags.themes.forEach((theme) => {
      counts.set(theme, (counts.get(theme) ?? 0) + 1)
    })
  })

  return Array.from(counts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export type GaugeDescriptor = {
  label: string
  value: number
  max: number
  description?: string
}

export const getFidelityGauges = (story: Story): GaugeDescriptor[] => [
  {
    label: 'Entity coverage',
    value: story.metrics.fidelity.entity_coverage_pct,
    max: 100,
    description: 'Proportion of seed entities reflected in story',
  },
  {
    label: 'Contradictions',
    value: story.metrics.fidelity.contradictions,
    max: Math.max(1, story.metrics.fidelity.contradictions),
    description: 'Lower is better; contradictions vs. seed',
  },
]

export const getConcretenessGauges = (story: Story): GaugeDescriptor[] => [
  {
    label: 'Time refs',
    value: story.metrics.concreteness.time_refs,
    max: Math.max(4, story.metrics.concreteness.time_refs),
  },
  {
    label: 'Place refs',
    value: story.metrics.concreteness.place_refs,
    max: Math.max(4, story.metrics.concreteness.place_refs),
  },
  {
    label: 'Objects',
    value: story.metrics.concreteness.object_refs,
    max: Math.max(6, story.metrics.concreteness.object_refs),
  },
  {
    label: 'Sensory terms',
    value: story.metrics.concreteness.sensory_terms,
    max: Math.max(6, story.metrics.concreteness.sensory_terms),
  },
]

export const getHallucinationGauges = (story: Story): GaugeDescriptor[] => [
  {
    label: 'New proper nouns',
    value: story.metrics.hallucinations.new_proper_nouns,
    max: Math.max(3, story.metrics.hallucinations.new_proper_nouns),
    description: 'Proper nouns invented beyond the seed',
  },
]
