import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Layers, Search, BarChart3, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'

/**
 * BottomBar
 *
 * Persistent bottom navigation for mobile (<md).
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const ITEMS = [
  { to: '/dashboard', label: 'Home',    icon: LayoutDashboard },
  { to: '/events',    label: 'Events',  icon: Layers },
  { to: '/bias',      label: 'Bias',    icon: BarChart3 },
  { to: '/playground',label: 'Play',    icon: Sparkles },
  { to: '/search',    label: 'Search',  icon: Search, action: 'search' },
]

export default function BottomBar({ className, onSearchClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-30',
        'bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)]',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <ul className="grid grid-cols-5 h-14">
        {ITEMS.map(item => {
          const isSearch = item.action === 'search'
          if (isSearch) {
            return (
              <li key="search" className="flex">
                <button
                  type="button"
                  onClick={onSearchClick ?? (() => navigate('/search'))}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[var(--color-text-muted)] active:text-[var(--color-text)]"
                  aria-label="Open search"
                >
                  <item.icon size={18} aria-hidden="true" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              </li>
            )
          }
          const isActive = location.pathname.startsWith(item.to)
          return (
            <li key={item.to} className="flex">
              <NavLink
                to={item.to}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                  isActive ? 'text-[var(--color-brand-600)]' : 'text-[var(--color-text-muted)] active:text-[var(--color-text)]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={18} aria-hidden="true" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
