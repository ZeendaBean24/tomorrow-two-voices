import { useEffect } from 'react';

const SECTION_COLORS: Record<string, string> = {
  home: '#10B981',
  archive: '#4F46E5',
  insights: '#F59E0B',
  methods: '#64748B',
  submit: '#06B6D4',
  'not-found': '#7F1D1D',
};

type VisibleSection = {
  id: string;
  ratio: number;
};

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b]
    .map((value) => {
      const clamped = Math.max(0, Math.min(255, Math.round(value)));
      return clamped.toString(16).padStart(2, '0');
    })
    .join('')}`;

const mixColors = (a: string, b: string, weight: number) => {
  if (weight <= 0) return a;
  if (weight >= 1) return b;
  const colorA = hexToRgb(a);
  const colorB = hexToRgb(b);
  return rgbToHex({
    r: lerp(colorA.r, colorB.r, weight),
    g: lerp(colorA.g, colorB.g, weight),
    b: lerp(colorA.b, colorB.b, weight),
  });
};

const BackgroundWash = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion);

    const ratios = new Map<Element, VisibleSection>();
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.section-root'));

    const applyColor = () => {
      const visible = Array.from(ratios.values())
        .filter((entry) => entry.ratio > 0)
        .sort((a, b) => b.ratio - a.ratio);

      const primary = visible[0] ?? { id: 'home', ratio: 1 };
      const secondary = visible[1];

      let nextColor = SECTION_COLORS[primary.id] ?? SECTION_COLORS.home;

      if (!prefersReducedMotion && secondary) {
        const total = primary.ratio + secondary.ratio;
        const weight = total === 0 ? 0 : secondary.ratio / total;
        nextColor = mixColors(nextColor, SECTION_COLORS[secondary.id] ?? nextColor, weight);
      }

      document.documentElement.style.setProperty('--wash-color', nextColor);
    };

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        applyColor();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.section ?? 'home';
          ratios.set(entry.target, { id, ratio: entry.intersectionRatio });
        });
        scheduleUpdate();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    scheduleUpdate();

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove('reduce-motion');
    };
  }, []);

  return <div aria-hidden="true" className="wash-layer" />;
};

export default BackgroundWash;
