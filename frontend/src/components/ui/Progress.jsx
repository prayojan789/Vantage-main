import { cn } from '../../lib/utils.js'

/**
 * Progress
 *
 * Chakra-style linear progress bar.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const colorSchemes = {
  brand: 'bg-[var(--color-brand-500)]',
  blue:  'bg-[var(--color-blue-500)]',
  green: 'bg-[var(--color-success)]',
  red:   'bg-[var(--color-danger)]',
  yellow:'bg-[var(--color-warning)]',
  purple:'bg-[var(--color-purple-500)]',
}

const sizes = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export function Progress({
  value = 0,
  max = 100,
  colorScheme = 'brand',
  size = 'md',
  hasStripe = false,
  isAnimated = false,
  isIndeterminate = false,
  className,
  ...rest
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        'w-full overflow-hidden rounded-full bg-[var(--color-surface-sunken)]',
        sizes[size] || sizes.md,
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          colorSchemes[colorScheme] || colorSchemes.brand,
          hasStripe && 'bg-[length:1rem_1rem] bg-no-repeat',
          hasStripe && 'bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]',
          isAnimated && 'anim-[shimmer_1s_linear_infinite]',
        )}
        style={{ width: isIndeterminate ? '40%' : `${pct}%` }}
      />
    </div>
  )
}

export function ProgressLabel({ children, className }) {
  return (
    <div className={cn('flex items-center justify-between text-xs font-semibold', className)}>
      <span className="text-[var(--color-text-muted)]">{children}</span>
    </div>
  )
}
