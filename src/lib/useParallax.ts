import { useCallback, useEffect, useRef, useState } from 'react';

type RegisterFn = (element: HTMLElement | null) => void;

type UseParallaxReturn = {
  registerLayer: (index: number) => RegisterFn;
};

export const useParallax = (): UseParallaxReturn => {
  const layerRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef<number>(-1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    // Fallback for Safari < 14
    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      layerRefs.current.forEach((layer) => {
        if (layer) {
          const scale = Number(layer.dataset.scale ?? 1);
          layer.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
        }
      });
      return;
    }

    const applyTransform = () => {
      rafRef.current = null;
      const scrollY = window.scrollY;

      if (scrollY === lastScrollY.current) return;
      lastScrollY.current = scrollY;

      layerRefs.current.forEach((layer) => {
        if (!layer) return;
        const speed = Number(layer.dataset.speed ?? 0);
        const scale = Number(layer.dataset.scale ?? 1);
        const offset = Math.round(scrollY * speed * 100) / 100;
        layer.style.transform = `translate3d(${offset * 0.15}px, ${offset}px, 0) scale(${scale})`;
      });
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(applyTransform);
    };

    applyTransform();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  const registerLayer = useCallback(
    (index: number): RegisterFn =>
      (element) => {
        layerRefs.current[index] = element;
        if (element) {
          element.style.willChange = 'transform';
          const scale = Number(element.dataset.scale ?? 1);
          if (prefersReducedMotion) {
            element.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
          }
        }
      },
    [prefersReducedMotion],
  );

  return { registerLayer };
};
