import { X } from 'lucide-react'
import { cn } from '../../lib/utils.js'

/**
 * Tag / TagLabel / TagCloseButton
 *
 * Chakra-style tag (small, dismissible pill).
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const schemes = {
  gray:   'bg-[var(--color-surface-muted)] text-[var(--color-text)] border-[var(--color-border)]',
  brand:  'bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border-[var(--color-brand-200)]',
  blue:   'bg-[var(--color-blue-50)]   text-[var(--color-blue-600)]  border-[var(--color-blue-200)]',
  green:  'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]',
  red:    'bg-[var(--color-danger-bg)] text-[var(--color-danger)]  border-[var(--color-danger-border)]',
  yellow: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]',
  purple: 'bg-[var(--color-purple-50)] text-[var(--color-purple-600)] border-[var(--color-purple-200)]',
  pink:   'bg-[var(--color-pink-50)]   text-[var(--color-pink-600)]  border-[var(--color-pink-200)]',
}

const sizes = {
  sm: 'h-6 px-2 text-[0.65rem] gap-1',
  md: 'h-7 px-2.5 text-xs gap-1.5',
  lg: 'h-8 px-3 text-sm gap-2',
}

export function Tag({
  colorScheme = 'gray',
  size = 'md',
  variant = 'subtle',
  className,
  children,
  onClose,
  ...rest
}) {
  const scheme = schemes[colorScheme] || schemes.gray
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border',
        scheme,
        sizes[size],
        variant === 'outline' && 'bg-transparent',
        className,
      )}
      {...rest}
    >
      {children}
      {onClose ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onClose}
          className="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-60 transition-all hover:scale-110 hover:opacity-100 hover:bg-black/10 active:scale-90"
        >
          <X size={10} />
        </button>
      ) : null}
    </span>
  )
}

export function TagLabel({ children, className }) {
  return <span className={className}>{children}</span>
}

export function TagCloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mr-1 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-60 transition-all hover:scale-110 hover:opacity-100 hover:bg-black/10 active:scale-90"
      aria-label="Remove"
    >
      <X size={10} />
    </button>
  )
}
