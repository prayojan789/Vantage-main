import { cn } from '../../lib/utils.js'

/**
 * Switch
 *
 * Chakra-style toggle switch.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 * Uses design tokens for motion duration.
 */
const colorSchemes = {
  brand: { on: 'bg-[var(--color-brand-500)] border-[var(--color-brand-500)]' },
  blue:  { on: 'bg-[var(--color-blue-500)]  border-[var(--color-blue-500)]'  },
  green: { on: 'bg-[var(--color-success)] border-[var(--color-success)]' },
  red:   { on: 'bg-[var(--color-danger)]   border-[var(--color-danger)]'   },
}

const sizes = {
  sm: { track: 'h-4 w-7',  thumb: 'h-3 w-3', offPos: 'translate-x-0.5', onPos: 'translate-x-3.5' },
  md: { track: 'h-6 w-11', thumb: 'h-5 w-5', offPos: 'translate-x-0.5', onPos: 'translate-x-5.5' },
  lg: { track: 'h-7 w-14', thumb: 'h-6 w-6', offPos: 'translate-x-0.5', onPos: 'translate-x-7.5' },
}

export function Switch({
  isChecked,
  defaultChecked,
  onChange,
  colorScheme = 'brand',
  size = 'md',
  isDisabled = false,
  className,
  ...rest
}) {
  const sz = sizes[size] || sizes.md
  const scheme = colorSchemes[colorScheme] || colorSchemes.brand

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!isChecked}
      disabled={isDisabled}
      onClick={() => onChange?.(!isChecked)}
      className={cn(
        'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-180',
        sz.track,
        isChecked
          ? scheme.on
          : 'border-[var(--color-border)] bg-[var(--color-surface-sunken)]',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full bg-[var(--color-text-inverse)] shadow transition-transform duration-180',
          sz.thumb,
          isChecked ? sz.onPos : sz.offPos,
        )}
      />
    </button>
  )
}
