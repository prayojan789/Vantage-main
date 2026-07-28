import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils.js'
import Logo from '../Logo.jsx'
import { SIDEBAR_GROUPS, UTILITY_NAV } from '../../layouts/navConfig.jsx'

/**
 * NavRail
 *
 * A compact icon-only navigation rail for ultra-wide or dashboard-style
 * layouts. ~64px wide.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export default function NavRail({ className }) {
  return (
    <aside
      aria-label="Compact navigation"
      className={cn(
        'hidden xl:flex flex-col items-center h-screen sticky top-0 w-16 py-3',
        'bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)]',
        className,
      )}
    >
      <NavLink
        to="/dashboard"
        aria-label="Vantage home"
        className="transition-transform hover:scale-105"
      >
        <Logo size={36} showWordmark={false} />
      </NavLink>

      <div className="mt-4 flex-1 overflow-y-auto w-full flex flex-col items-center gap-3">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id} className="flex flex-col items-center gap-1 w-full">
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) => cn(
                  'group/rail inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-all duration-150',
                  isActive
                    ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)] shadow-[0_4px_12px_rgba(245,158,11,0.30)]'
                    : 'text-[var(--color-brand-600)] hover:text-[var(--color-text)] hover:bg-[var(--color-brand-200)]',
                )}
              >
                <item.icon size={16} aria-hidden="true" className="transition-transform group-hover/rail:scale-110" />
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 pt-2 border-t border-[var(--color-border-subtle)] w-full">
        {UTILITY_NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) => cn(
              'group/rail inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-all duration-150',
              isActive
                ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)] shadow-[0_4px_12px_rgba(245,158,11,0.30)]'
                : 'text-[var(--color-brand-600)] hover:text-[var(--color-text)] hover:bg-[var(--color-brand-200)]',
            )}
          >
            <item.icon size={16} aria-hidden="true" className="transition-transform group-hover/rail:scale-110" />
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
