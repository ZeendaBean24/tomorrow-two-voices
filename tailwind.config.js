import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          light: '#F8F7F4',
          dark: '#0B1020',
        },
        hope: '#10B981',
        sunrise: '#F59E0B',
        cyan: '#06B6D4',
        caution: '#B45309',
        oxblood: '#7F1D1D',
        slate: '#64748B',
        focus: '#4F46E5',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Merriweather"', 'serif'],
        body: ['Inter', '"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        artifact: '0 15px 35px rgba(11, 16, 32, 0.12)',
        artifactHover: '0 20px 45px rgba(11, 16, 32, 0.18)',
      },
      backgroundImage: {
        paper: 'url(/assets/paper-texture.svg)',
        splitGradient: 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(79,70,229,0.25) 50%, rgba(244,158,11,0.15) 100%)',
      },
      keyframes: {
        'hover-shift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'gradient-slide': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'hover-shift': 'hover-shift 350ms ease forwards',
        'gradient-slide': 'gradient-slide 2s ease infinite alternate',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};

export default config;
