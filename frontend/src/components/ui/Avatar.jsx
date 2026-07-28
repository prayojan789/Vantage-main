import { cn } from '../../lib/utils.js'

/**
 * Avatar / AvatarGroup
 *
 * Chakra-style avatar with optional name initials and color schemes.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const schemes = {
  brand:  'from-[var(--color-brand-500)] to-[var(--color-brand-300)]',
  blue:   'from-[var(--color-blue-400)] to-[var(--color-blue-600)]',
  green:  'from-[var(--color-success)] to-[var(--color-green-600)]',
  red:    'from-[var(--color-danger)] to-[var(--color-red-600)]',
  yellow: 'from-[var(--color-warning)] to-[var(--color-brand-400)]',
  purple: 'from-[var(--color-purple-500)] to-[var(--color-purple-600)]',
  gray:   'from-[var(--color-text-muted)] to-[var(--color-border-strong)]',
}

const sizeMap = {
  '2xs': 'avatar-xs h-5 w-5 text-[0.6rem]',
  xs:   'avatar-xs h-6 w-6 text-[0.625rem]',
  sm:   'avatar-sm h-8 w-8 text-xs',
  md:   'avatar-md h-10 w-10 text-sm',
  lg:   'avatar-lg h-14 w-14 text-base',
  xl:   'avatar-xl h-20 w-20 text-2xl',
  '2xl': 'avatar-xl h-24 w-24 text-3xl',
}

function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase()
}

export function Avatar({
  name,
  src,
  colorScheme = 'brand',
  size = 'md',
  className,
  ...rest
}) {
  return (
    <span
      className={cn(
        'avatar',
        sizeMap[size] || sizeMap.md,
        'bg-gradient-to-br',
        schemes[colorScheme] || schemes.brand,
        className,
      )}
      title={name}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name || ''} className="h-full w-full rounded-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  )
}

export function AvatarGroup({ avatars = [], size = 'sm', max = 4, className }) {
  const shown = avatars.slice(0, max)
  const extra = avatars.length - shown.length
  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {shown.map((a, i) => (
        <Avatar
          key={i}
          {...a}
          size={size}
          className="ring-2 ring-[var(--color-surface)]"
        />
      ))}
      {extra > 0 ? (
        <span
          className={cn(
            'avatar ring-2 ring-[var(--color-surface)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
            sizeMap[size] || sizeMap.sm,
          )}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
