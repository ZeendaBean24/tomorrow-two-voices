const splitter = /(?<=[.!?])\s+(?=[A-Z0-9"\[])/g

export const splitSentences = (text: string): string[] => {
  if (!text) return []
  return text
    .split(splitter)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}
