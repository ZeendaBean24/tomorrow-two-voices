import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { StoriesContextValue, Story } from './types'

const StoriesContext = createContext<StoriesContextValue | undefined>(undefined)

const STORIES_URL = '/data/stories.json'

type StoriesProviderProps = {
  children: ReactNode
}

export const StoriesProvider = ({ children }: StoriesProviderProps) => {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const controller = new AbortController()

    const loadStories = async () => {
      try {
        setIsLoading(true)
        setError(undefined)
        const response = await fetch(STORIES_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load stories (${response.status})`)
        }
        const payload = (await response.json()) as Story[]
        setStories(payload)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()

    return () => controller.abort()
  }, [])

  const value = useMemo<StoriesContextValue>(
    () => ({ stories, isLoading, error }),
    [stories, isLoading, error],
  )

  return (
    <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>
  )
}

export const useStories = (): StoriesContextValue => {
  const context = useContext(StoriesContext)
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider')
  }
  return context
}
