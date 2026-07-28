import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../lib/utils.js'

/**
 * BackButton
 *
 * Standardized "go back" affordance used across the app.
 *
 * Props:
 *   - to:        explicit route to navigate to. If omitted, uses browser back via navigate(-1).
 *   - label:     text shown next to the arrow. Default: "Back".
 *   - onClick:   extra click handler.
 *   - variant:   'pill' (default — bordered chip) or 'ghost' (subtle text).
 *   - fallback:  route to use if there's no history. Default: '/dashboard'.
 *   - className: extra classes.
 *
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export default function BackButton({
  to,
  label = 'Back',
  onClick,
  variant = 'pill',
  fallback = '/dashboard',
  className,
}) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (to) return // <Link> handles the navigation
    e.preventDefault()
    // If the user landed on this page directly, there's no history —
    // fall back to a sensible default route.
    if (window.history.length > 1) navigate(-1)
    else navigate(fallback, { replace: true })
  }

  const base =
    'group inline-flex w-fit items-center gap-1.5 text-xs font-semibold transition-all duration-150 active:scale-95'

  const styles = {
    pill:
      'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] h-9 px-3 text-[var(--color-text-muted)] hover:border-[var(--color-brand-300)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)] hover:shadow-sm',
    ghost:
      'text-[var(--color-text-muted)] hover:text-[var(--color-brand-600)]',
  }[variant]

  const iconClass =
    'transition-transform duration-150 group-hover:-translate-x-0.5'

  const content = (
    <>
      <ArrowLeft size={14} className={iconClass} />
      {label}
    </>
  )

  if (to) {
    return (
      <Link to={to} onClick={handleClick} className={cn(base, styles, className)}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(base, styles, 'cursor-pointer', className)}
    >
      {content}
    </button>
  )
}
