import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8F7F4',
        emerald: '#10B981',
        indigo: '#4F46E5',
        gold: '#F59E0B',
        cyan: '#06B6D4',
        slate: '#64748B',
        rust: '#B45309',
        oxblood: '#7F1D1D',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Merriweather"', 'serif'],
        body: ['Inter', '"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 20px 40px rgba(10, 15, 35, 0.12)',
        cardHover: '0 26px 55px rgba(10, 15, 35, 0.18)',
      },
      backgroundImage: {
        paper: 'url(/assets/paper-texture.svg)',
        wash: 'radial-gradient(1200px 600px at 50% -10%, var(--wash-color, #10B981) 0%, rgba(248, 247, 244, 0) 70%)',
        noise:
          "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 200 200\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'200\\' height=\\'200\\' filter=\\'url(#n)\\' opacity=\\'.08'/></svg>')",
      },
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        'ease-out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      keyframes: {
        caret: {
          '0%, 40%': { opacity: '1' },
          '60%, 100%': { opacity: '0' },
        },
        parallax: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(0, -4px, 0)' },
        },
      },
      animation: {
        caret: 'caret 1s steps(1, end) infinite',
        parallax: 'parallax 600ms ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};

export default config;
