import { useCallback, useEffect, useRef, useState } from 'react'

type RegisterFn = (element: HTMLElement | null) => void

type UseParallaxReturn = {
  registerLayer: (index: number) => RegisterFn
}

type LayerEntry = {
  node: HTMLElement | null
  speed: number
  scale: number
  minScale: number
  deltaScale: number
  startOffset: number
  endOffset: number
  maxX: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const useParallax = (): UseParallaxReturn => {
  const layersRef = useRef<LayerEntry[]>([])
  const rafRef = useRef<number | null>(null)
  const resizeRafRef = useRef<number | null>(null)
  const lastScrollY = useRef<number>(-1)
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false)

  const updateBounds = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight

    layersRef.current.forEach((entry) => {
      if (!entry.node) return
      const referenceScale = Math.max(entry.scale, entry.minScale)
      const extraX = Math.max(0, (referenceScale - 1) * vw)
      const extraY = Math.max(0, (referenceScale - 1) * vh)
      entry.maxX = extraX / 2
    })
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference)
      return () => mediaQuery.removeEventListener('change', updatePreference)
    }

    // Fallback for Safari < 14
    mediaQuery.addListener(updatePreference)
    return () => mediaQuery.removeListener(updatePreference)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      layersRef.current.forEach((entry) => {
        if (!entry.node) return
        entry.node.style.transform = `translate3d(0, ${entry.startOffset}px, 0) scale(${entry.scale})`
      })
      return
    }

    const applyTransform = (force = false) => {
      rafRef.current = null
      const scrollY = window.scrollY

      if (!force && scrollY === lastScrollY.current) return
      lastScrollY.current = scrollY

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const scrollProgress =
        maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0

      layersRef.current.forEach((entry) => {
        const layer = entry.node
        if (!layer) return
        const baseOffset = scrollY * entry.speed
        const horizontal = clamp(baseOffset * 0.04, -entry.maxX, entry.maxX)
        const vertical =
          entry.startOffset +
          (entry.endOffset - entry.startOffset) * scrollProgress
        const dynamicScale = Math.max(
          entry.minScale,
          entry.scale - entry.deltaScale * scrollProgress,
        )
        layer.style.transform = `translate3d(${horizontal}px, ${vertical}px, 0) scale(${dynamicScale})`
      })
    }

    const handleScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(() => applyTransform())
    }

    const handleResize = () => {
      if (resizeRafRef.current !== null) return
      resizeRafRef.current = window.requestAnimationFrame(() => {
        updateBounds()
        applyTransform(true)
        resizeRafRef.current = null
      })
    }

    updateBounds()
    applyTransform(true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [prefersReducedMotion, updateBounds])

  const registerLayer = useCallback(
    (index: number): RegisterFn =>
      (element) => {
        const speed = Number(element?.dataset.speed ?? 0)
        const scale = Number(element?.dataset.scale ?? 1)
        const minScale = Number(element?.dataset.minScale ?? scale)
        const startOffset = Number(element?.dataset.startOffset ?? 0)
        const endOffset = Number(element?.dataset.endOffset ?? startOffset)

        layersRef.current[index] = {
          node: element,
          speed,
          scale,
          minScale,
          deltaScale: Math.max(0, scale - minScale),
          startOffset,
          endOffset,
          maxX: layersRef.current[index]?.maxX ?? 0,
        }

        if (element) {
          element.style.willChange = 'transform'
          if (prefersReducedMotion) {
            element.style.transform = `translate3d(0, ${startOffset}px, 0) scale(${scale})`
          } else {
            updateBounds()
            element.style.transform = `translate3d(0, ${startOffset}px, 0) scale(${scale})`
          }
        }
      },
    [prefersReducedMotion, updateBounds],
  )

  return { registerLayer }
}
