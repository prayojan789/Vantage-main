import { Info, AlertTriangle, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'

/**
 * Alert
 *
 * Chakra-style status alert with soft color schemes.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const statusMap = {
  info:     { Icon: Info,          bg: 'bg-[var(--color-info-bg)]',   fg: 'text-[var(--color-info)]',   border: 'border-[var(--color-info-border)]' },
  success:  { Icon: CheckCircle2,  bg: 'bg-[var(--color-success-bg)]',   fg: 'text-[var(--color-success)]',   border: 'border-[var(--color-success-border)]' },
  warning:  { Icon: AlertTriangle, bg: 'bg-[var(--color-warning-bg)]',  fg: 'text-[var(--color-warning)]',  border: 'border-[var(--color-warning-border)]' },
  error:    { Icon: XCircle,       bg: 'bg-[var(--color-danger-bg)]',     fg: 'text-[var(--color-danger)]',     border: 'border-[var(--color-danger-border)]' },
  brand:    { Icon: Sparkles,      bg: 'bg-[var(--color-brand-50)]',   fg: 'text-[var(--color-brand-700)]',   border: 'border-[var(--color-brand-200)]' },
}

const variantMap = {
  subtle: '',
  solid:  'border-transparent text-white [&_.alert-title]:!text-white [&_.alert-desc]:!text-white/90',
  leftAccent: 'border-l-4',
}

export function Alert({
  status = 'info',
  variant = 'subtle',
  className,
  children,
  ...rest
}) {
  const s = statusMap[status] || statusMap.info
  const isSolid = variant === 'solid'
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-sm',
        s.bg,
        s.fg,
        s.border,
        variantMap[variant],
        isSolid && 'bg-gradient-to-br from-[var(--color-brand-600)] to-[var(--color-brand-500)] border-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function AlertIcon({ status = 'info', className }) {
  const s = statusMap[status] || statusMap.info
  const Icon = s.Icon
  return <Icon size={18} className={cn('mt-0.5 flex-shrink-0', s.fg, className)} />
}

export function AlertTitle({ className, children }) {
  return <p className={cn('alert-title text-sm font-semibold', className)}>{children}</p>
}

export function AlertDescription({ className, children }) {
  return <p className={cn('alert-desc text-xs text-current/80 leading-relaxed', className)}>{children}</p>
}
