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
  <header className="sticky top-0 z-40 border-b border-slate/15 bg-paper/80 backdrop-blur-sm">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Tomorrow, In Two Voices" className="h-10 w-auto" />
        <div className="leading-tight">
          <p className="text-lg text-slate">Tomorrow, In Two Voices</p>
          <p className="text-xs text-slate/70">2050 imagined through hopeful and cautionary futures</p>
        </div>
      </div>
      <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:focus-ring ${
                isActive
                  ? 'bg-indigo/15 text-indigo shadow'
                  : 'text-slate/80 hover:bg-paper/80 hover:text-slate'
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
