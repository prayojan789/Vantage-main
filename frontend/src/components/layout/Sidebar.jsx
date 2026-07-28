import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import Logo from '../Logo.jsx'
import { SIDEBAR_GROUPS } from '../../layouts/navConfig.jsx'

/**
 * Sidebar — Chakra-style navigation
 *
 * Persistent, collapsible sidebar with a brand block, grouped nav
 * links, and a footer that surfaces additional page shortcuts.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const STORAGE_KEY = 'vantage-sidebar-collapsed'

function readCollapsed() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export default function Sidebar({ className }) {
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      }
      return next
    })
  }

  return (
    <aside
      aria-label="Primary navigation"
      data-collapsed={collapsed || undefined}
      className={cn(
        'group/sidebar hidden md:flex flex-col h-screen sticky top-0 z-30',
        'bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)]',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[72px]' : 'w-64',
        className,
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-border-subtle)] px-4">
        <Link
          to="/dashboard"
          aria-label="Vantage home"
          className="flex-shrink-0 transition-transform hover:scale-105"
        >
          <Logo size={36} showWordmark={!collapsed} tagline={collapsed ? null : 'News Intel · NP'} />
        </Link>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id} className={cn('mb-5 flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-3')}>
            {!collapsed ? (
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                {group.label}
              </p>
            ) : (
              <div className="mx-2 mb-1.5 h-px bg-[var(--color-border)]" aria-hidden="true" />
            )}
            {group.items.map(item => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    'group/item flex items-center gap-2.5 rounded-[var(--radius-lg)] text-sm font-medium',
                    'transition-all duration-150',
                    collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
                    isActive
                      ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)] shadow-[0_4px_12px_rgba(245,158,11,0.30)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-brand-200)] hover:text-[var(--color-text)]',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {Icon ? (
                        <Icon
                          size={15}
                          className={cn(
                            'flex-shrink-0',
                            collapsed ? '' : 'mr-0.5',
                            isActive ? 'text-[var(--color-text-inverse)]' : 'text-[var(--color-text-muted)] group-hover/item:text-[var(--color-text)]',
                          )}
                        />
                      ) : null}
                      {!collapsed ? (
                        <span className="truncate">{item.label}</span>
                      ) : null}
                      {!collapsed && isActive ? (
                        <span className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-text-inverse)]" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute -right-3 top-20 z-40 hidden md:inline-flex h-6 w-6 items-center justify-center rounded-full',
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-md',
          'transition-all duration-150 hover:scale-110 hover:border-[var(--color-brand-300)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)]',
        )}
      >
        {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
      </button>
    </aside>
  )
}
