import { useEffect, useRef, useState, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, Search, Bell, Sun, Moon, Monitor, ChevronDown, Sparkles,
  Command, LogOut, Settings as SettingsIcon, LayoutDashboard,
  User as UserIcon, BellRing, Newspaper,
} from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { useTheme } from '../../providers/ThemeProvider.jsx'
import { useAuth } from '../../providers/AuthProvider.jsx'
import { Avatar } from '../ui/Avatar.jsx'

/**
 * TopBar
 *
 * Sticky header with brand, search, theme switcher, notifications and
 * user menu. Chakra-style soft surface, soft border, no harsh lines.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export default function TopBar({ onMenuClick, className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [themeOpen, setThemeOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [signOutConfirm, setSignOutConfirm] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const themeRef = useRef(null)
  const userRef = useRef(null)

  const initialsName = user?.name || 'Guest'

  useEffect(() => {
    if (!themeOpen) return undefined
    const handler = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [themeOpen])

  useEffect(() => {
    if (!userOpen) return undefined
    const handler = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [userOpen])

  const handleSearch = (e) => {
    e?.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
    } else {
      navigate('/search')
    }
  }

  // Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        document.querySelector('input[data-cmdk]')?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const requestSignOut = () => {
    setUserOpen(false)
    setSignOutConfirm(true)
  }

  const confirmSignOut = () => {
    signOut()
    setSignOutConfirm(false)
    navigate('/sign-in', { replace: true, state: { signedOut: true } })
  }

  const cancelSignOut = () => {
    setSignOutConfirm(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/85 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex h-full max-w-[1680px] items-center gap-2 px-4 mx-auto sm:px-6 lg:px-8">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="icon-btn md:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="ml-auto flex items-center gap-1">
          {/* Mobile search */}
          <Link
            to="/search"
            aria-label="Open search"
            className="icon-btn md:hidden"
          >
            <Search size={16} />
          </Link>

          {/* Notification bell */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="icon-btn relative"
          >
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 inline-block h-2 w-2 rounded-full bg-[var(--color-danger)] shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
          </Link>

          {/* Theme switcher */}
          <div ref={themeRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={themeOpen}
              aria-label={`Theme: ${theme}`}
              className="icon-btn"
            >
              <ThemeIcon theme={theme} />
            </button>
            {themeOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-50"
              >
                {[
                  { value: 'light',  label: 'Light',  Icon: Sun },
                  { value: 'dark',   label: 'Dark',   Icon: Moon },
                  { value: 'system', label: 'System', Icon: Monitor },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={theme === value}
                    onClick={() => { setTheme(value); setThemeOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 h-9 text-sm font-medium transition-colors',
                      theme === value
                        ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* User menu */}
          {user ? (
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setUserOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 text-[var(--color-text-muted)] transition-all hover:border-[var(--color-brand-300)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-text)]"
              >
                <Avatar name={initialsName} size="xs" />
                <ChevronDown size={12} className="hidden transition-transform sm:inline-block group-aria-expanded:rotate-180" />
              </button>
              {userOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl z-50"
                >
                  <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-3 py-3">
                    <Avatar name={initialsName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--color-text)]">{user.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{user.email}</p>
                    </div>
                  </div>
                  {[
                    { to: '/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
                    { to: '/settings',      label: 'Settings',      Icon: SettingsIcon },
                    { to: '/notifications', label: 'Notifications', Icon: BellRing },
                  ].map(({ to, label, Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setUserOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2 px-3 h-9 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)]"
                    >
                      <Icon size={14} /> {label}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--color-border-subtle)]">
                    <button
                      type="button"
                      onClick={requestSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 h-9 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)]"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] bg-[var(--color-brand-500)] px-3 text-xs font-semibold text-[var(--color-text-inverse)] shadow-sm transition-all hover:scale-[1.04] hover:bg-[var(--color-brand-600)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.35)]"
            >
              <UserIcon size={13} /> Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Sign-out confirmation */}
      {signOutConfirm ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm anim-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
          onClick={cancelSignOut}
        >
          <div
            className="card-elevated w-[min(420px,90vw)] p-6 anim-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]">
                <LogOut size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="signout-title" className="text-base font-bold text-[var(--color-text)]">
                  Sign out of Vantage?
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  You'll need to sign in again to access your dashboard, saved searches, and notifications.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={cancelSignOut}
                className="btn btn-md btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSignOut}
                className="btn btn-md bg-[var(--color-danger)] text-[var(--color-text-inverse)] hover:bg-[var(--color-danger)]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function ThemeIcon({ theme }) {
  if (theme === 'light')  return <Sun size={16} />
  if (theme === 'dark')   return <Moon size={16} />
  return <Monitor size={16} />
}
