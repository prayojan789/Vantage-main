import { cn } from '../../lib/utils.js'

/**
 * Stat / StatLabel / StatNumber / StatHelpText / StatIcon
 *
 * Chakra-style statistic tile.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export function Stat({ className, children, ...rest }) {
  return <div className={cn('flex flex-col gap-1', className)} {...rest}>{children}</div>
}

export function StatLabel({ className, children, ...rest }) {
  return (
    <span
      className={cn(
        'text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export function StatNumber({ className, children, size = 'lg', ...rest }) {
  const sizes = {
    sm:  'text-lg font-bold',
    md:  'text-xl font-bold',
    lg:  'text-2xl font-bold',
    xl:  'text-3xl font-bold',
  }
  return (
    <span className={cn('text-[var(--color-text)] tabular-nums tracking-tight', sizes[size], className)} {...rest}>
      {children}
    </span>
  )
}

export function StatHelpText({ className, children, ...rest }) {
  return (
    <span
      className={cn('text-xs text-[var(--color-text-muted)] flex items-center gap-1', className)}
      {...rest}
    >
      {children}
    </span>
  )
}

export function StatIcon({ className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]',
        'bg-[var(--color-brand-50)] text-[var(--color-brand-600)]',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

/**
 * StatCard
 *
 * High-level card-shaped stat (Chakra's <Stat> wrapped in a <Card>).
 * Used in stat strips across pages.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const accentMap = {
  brand:  { bg: 'bg-[var(--color-brand-50)]',  fg: 'text-[var(--color-brand-600)]'  },
  blue:   { bg: 'bg-[var(--color-blue-50)]',   fg: 'text-[var(--color-blue-600)]'     },
  green:  { bg: 'bg-[var(--color-success-bg)]',  fg: 'text-[var(--color-success)]'  },
  red:    { bg: 'bg-[var(--color-danger-bg)]',    fg: 'text-[var(--color-danger)]'    },
  yellow: { bg: 'bg-[var(--color-warning-bg)]', fg: 'text-[var(--color-warning)]' },
  purple: { bg: 'bg-[var(--color-purple-50)]', fg: 'text-[var(--color-purple-600)]' },
  pink:   { bg: 'bg-[var(--color-pink-50)]',   fg: 'text-[var(--color-pink-600)]'   },
  teal:   { bg: 'bg-[var(--color-teal-50)]',   fg: 'text-[var(--color-teal-600)]'   },
  cyan:   { bg: 'bg-[var(--color-cyan-50)]',   fg: 'text-[var(--color-cyan-600)]'     },
  orange: { bg: 'bg-[var(--color-brand-50)]', fg: 'text-[var(--color-brand-700)]' },
}

export function StatCard({
  label,
  value,
  sub,
  delta,
  icon: Icon,
  accent = 'brand',
  className,
}) {
  const a = accentMap[accent] || accentMap.brand
  return (
    <div className={cn('card-elevated p-5', className)}>
      <div className="flex items-start justify-between">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          {label}
        </span>
        {Icon ? (
          <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]', a.bg, a.fg)}>
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-[var(--color-text)] tabular-nums">{value}</span>
        {delta ? (
          <span
            className={cn(
              'text-xs font-semibold',
              delta.tone === 'up'   && 'text-[var(--color-success)]',
              delta.tone === 'down' && 'text-[var(--color-danger)]',
              !delta.tone           && 'text-[var(--color-text-muted)]',
            )}
          >
            {delta.label}
          </span>
        ) : null}
      </div>
      {sub ? <p className="mt-1 text-xs text-[var(--color-text-muted)]">{sub}</p> : null}
    </div>
  )
}
