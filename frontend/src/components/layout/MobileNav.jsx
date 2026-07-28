import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import Logo from '../Logo.jsx'
import { SIDEBAR_GROUPS } from '../../layouts/navConfig.jsx'

/**
 * MobileNav
 *
 * Drawer-style mobile navigation. Slides in from the left on small
 * screens.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export default function MobileNav({ open, onClose, className }) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
          className,
        )}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--color-surface)] shadow-2xl transition-transform duration-200 ease-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-border-subtle)] px-4">
          <div className="flex items-center gap-2.5">
            <Logo size={36} />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
          >
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {SIDEBAR_GROUPS.map(group => (
            <div key={group.id} className="mb-5">
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                {group.label}
              </p>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    'flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2.5 h-10 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-brand-200)] hover:text-[var(--color-text)]',
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
