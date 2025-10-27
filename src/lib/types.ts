export type StoryVariantId = 'hopeful' | 'balanced' | 'cautionary'

export type StoryVariant = {
  title: string
  text: string
}

export type StoryMetrics = Record<string, unknown>

export type StorySeed = {
  respondent_id?: string
  language: string
  age_band: string
  consent?: boolean
  hope: string
  worry: string
  ai_future: string
  technology: string
  object: string
  place: string
  time: string
  person_or_role: string
  value: string
  sensory_detail: string
  central_actor: string
  themes: string[]
}

export type Story = {
  id: string
  submitted_at: string
  seed: StorySeed
  ai: Record<StoryVariantId, StoryVariant>
  metrics: StoryMetrics
}

export type StoriesResponse = Story[]

export type ThemeFrequency = {
  theme: string
  count: number
}

export type StoriesContextValue = {
  stories: Story[]
  isLoading: boolean
  error?: string
}
