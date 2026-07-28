import { cn } from '../../lib/utils.js'

/**
 * Badge
 *
 * Chakra-style small status indicator with soft color schemes.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const schemes = {
  gray:   'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  brand:  'bg-[var(--color-brand-50)]      text-[var(--color-brand-700)]     border-[var(--color-brand-200)]',
  blue:   'bg-[var(--color-blue-50)]       text-[var(--color-blue-600)]      border-[var(--color-blue-200)]',
  green:  'bg-[var(--color-success-bg)]    text-[var(--color-success)]       border-[var(--color-success-border)]',
  red:    'bg-[var(--color-danger-bg)]     text-[var(--color-danger)]        border-[var(--color-danger-border)]',
  yellow: 'bg-[var(--color-warning-bg)]    text-[var(--color-warning)]       border-[var(--color-warning-border)]',
  purple: 'bg-[var(--color-purple-50)]     text-[var(--color-purple-600)]    border-[var(--color-purple-200)]',
  pink:   'bg-[var(--color-pink-50)]       text-[var(--color-pink-600)]      border-[var(--color-pink-200)]',
  teal:   'bg-[var(--color-teal-50)]       text-[var(--color-teal-600)]      border-[var(--color-teal-200)]',
  cyan:   'bg-[var(--color-cyan-50)]       text-[var(--color-cyan-600)]      border-[var(--color-cyan-200)]',
  orange: 'bg-[var(--color-brand-50)]     text-[var(--color-brand-700)]     border-[var(--color-brand-200)]',
}

const variants = {
  subtle: '',
  solid:  'border-transparent',
  outline: 'bg-transparent',
}

export function Badge({
  colorScheme = 'gray',
  variant = 'subtle',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const scheme = schemes[colorScheme] || schemes.gray
  const variantClass = variants[variant] || variants.subtle

  const sizeClass = {
    sm: 'text-[0.625rem] h-5 px-2',
    md: 'text-[0.7rem]  h-6 px-2.5',
    lg: 'text-xs       h-7 px-3',
  }[size]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap',
        scheme,
        variantClass,
        sizeClass,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
