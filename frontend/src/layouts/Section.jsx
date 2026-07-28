import { forwardRef } from 'react'
import { cn } from '../lib/utils.js'

/**
 * Section
 *
 * A vertical rhythm primitive used inside PageContainer. Provides:
 *   - consistent vertical spacing
 *   - optional title / description / actions header
 *   - a flexible content slot
 *
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export const Section = forwardRef(function Section(
  {
    as: Tag = 'section',
    eyebrow,
    title,
    description,
    actions,
    spacing = 'lg',
    bordered = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const SPACING = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  }

  return (
    <Tag
      ref={ref}
      className={cn(SPACING[spacing] ?? SPACING.lg, bordered && 'pb-6 border-b border-[var(--color-border)]', className)}
      {...rest}
    >
      {(eyebrow || title || description || actions) ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="section-label mb-2 text-[var(--color-text-muted)]">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </Tag>
  )
})
