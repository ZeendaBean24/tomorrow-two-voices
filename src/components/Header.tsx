import { NavLink } from 'react-router-dom'
import logo from '@assets/logo.svg'

const links = [
  { to: '/', label: 'Home' },
  { to: '/archive', label: 'Archive' },
  { to: '/insights', label: 'Insights' },
  { to: '/methods', label: 'Methods' },
  { to: '/submit', label: 'Submit' },
]

export const Header = () => (
  <header className="glass-panel sticky top-0 z-60 rounded-none border-b border-white/25 bg-white/18 backdrop-blur-xl">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Tomorrow, In Two Voices" className="h-10 w-auto" />
        <div className="leading-tight">
          <p className="glass-heading text-lg">Tomorrow, In Two Voices</p>
          <p className="text-xs text-slate/75">
            2050 imagined through hopeful and cautionary futures
          </p>
        </div>
      </div>
      <nav
        aria-label="Main navigation"
        className="flex flex-wrap items-center gap-2"
      >
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition focus-visible:focus-ring ring-1 ring-white/25 ${
                isActive
                  ? 'bg-white/30 text-indigo-700 shadow ring-indigo-500/30'
                  : 'bg-white/18 text-slate/80 hover:bg-white/24'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  </header>
)

export default Header
