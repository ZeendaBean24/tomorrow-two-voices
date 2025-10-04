import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type TiltOptions = {
  maxDeg?: number
  baseShadow?: string
  activeShadow?: string
}

export const useTilt = ({
  maxDeg = 5,
  baseShadow = '0.06',
  activeShadow = '0.18',
}: TiltOptions = {}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reset = () => {
      element.style.setProperty('--tilt-x', '0deg')
      element.style.setProperty('--tilt-y', '0deg')
      element.style.setProperty('--tilt-shadow-strength', baseShadow)
    }

    reset()

    if (prefersReducedMotion) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const xRatio = (event.clientX - rect.left) / rect.width
      const yRatio = (event.clientY - rect.top) / rect.height
      const rotateY = (xRatio - 0.5) * maxDeg * 2
      const rotateX = (0.5 - yRatio) * maxDeg * 2

      element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
      element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
      element.style.setProperty('--tilt-shadow-strength', activeShadow)
    }

    const handlePointerLeave = () => {
      reset()
    }

    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerleave', handlePointerLeave)
    element.addEventListener('pointercancel', handlePointerLeave)

    return () => {
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerleave', handlePointerLeave)
      element.removeEventListener('pointercancel', handlePointerLeave)
    }
  }, [activeShadow, baseShadow, maxDeg, prefersReducedMotion])

  return ref
}
