import { NavLink } from 'react-router-dom';
import logo from '@assets/logo.svg';

const links = [
  { to: '/', label: 'Home' },
  { to: '/archive', label: 'Archive' },
  { to: '/insights', label: 'Insights' },
  { to: '/methods', label: 'Methods' },
  { to: '/submit', label: 'Submit' },
];

export const Header = () => (
  <header className="bg-base-light/95 backdrop-blur supports-backdrop-blur:backdrop-blur sticky top-0 z-40 shadow-sm">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Tomorrow, In Two Voices" className="h-10 w-auto" />
        <div className="leading-tight">
          <p className="font-display text-lg text-slate-900">Tomorrow, In Two Voices</p>
          <p className="text-xs text-slate-600">2050 imagined through hopeful and cautionary futures</p>
        </div>
      </div>
      <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-focus ${
                isActive ? 'bg-focus/10 text-focus' : 'text-slate-700 hover:bg-slate-900/70 hover:bg-slate-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  </header>
);

export default Header;
