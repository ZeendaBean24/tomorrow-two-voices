export type Influence = {
  story: 'hopeful' | 'cautionary';
  sent_idx: number;
};

export type Evidence = {
  seed_phrase: string;
  influences: Influence[];
  why?: string;
};

export type StoryMetrics = {
  fidelity: {
    entity_coverage_pct: number;
    contradictions: number;
  };
  concreteness: {
    time_refs: number;
    place_refs: number;
    object_refs: number;
    sensory_terms: number;
  };
  hallucinations: {
    new_proper_nouns: number;
  };
};

export type StoryTags = {
  themes: string[];
  construal: 'Near' | 'Far';
  agency: 'Individual' | 'Shared' | 'Collective' | 'Automated' | 'Hybrid' | 'Unknown' | string;
  affect: 'Positive' | 'Negative' | 'Mixed' | 'Neutral' | string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical' | string;
};

export type StorySeed = {
  text: string;
  age_band: string;
};

export type Story = {
  id: string;
  submitted_at: string;
  seed: StorySeed;
  ai: {
    hopeful: string;
    cautionary: string;
    evidence: Evidence[];
  };
  tags: StoryTags;
  metrics: StoryMetrics;
};

export type StoriesResponse = Story[];

export type ThemeFrequency = {
  theme: string;
  count: number;
};

export type StoriesContextValue = {
  stories: Story[];
  isLoading: boolean;
  error?: string;
};
