import { forwardRef } from 'react'
import { cn } from '../lib/utils.js'

/**
 * PageContainer
 *
 * Top-level wrapper that constrains page content to a comfortable reading width,
 * applies consistent horizontal/vertical rhythm, and standardises the page
 * background. Should be used once per route as the outermost layout element.
 *
 * @param {object}  props
 * @param {string}  [props.width]  - 'narrow' | 'default' | 'wide' | 'full'
 * @param {boolean} [props.flush]  - removes vertical padding (for full-bleed pages)
 * @param {string}  [props.className]
 */
const WIDTHS = {
  narrow:   'max-w-[860px]',
  default:  'max-w-[1280px]',
  wide:     'max-w-[1480px]',
  full:     'max-w-none',
}

export const PageContainer = forwardRef(function PageContainer(
  { width = 'default', flush = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-10',
        WIDTHS[width] ?? WIDTHS.default,
        flush ? '' : 'py-6 lg:py-8',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

/**
 * PageHeader
 *
 * Renders a consistent page header: optional eyebrow, title, description,
 * and right-aligned action slot.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export function PageHeader({ eyebrow, title, description, actions, className, children }) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 pb-6 mb-6 border-b border-[var(--color-border)] md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="section-label mb-2 text-[var(--color-text-muted)]">{eyebrow}</p>
        ) : null}
        {title ? (
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-2 text-sm sm:text-base text-[var(--color-text-muted)] max-w-2xl">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>
      ) : null}
    </header>
  )
}
