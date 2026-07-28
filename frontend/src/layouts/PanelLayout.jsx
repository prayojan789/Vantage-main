import { Children, cloneElement, isValidElement } from 'react'
import { cn } from '../lib/utils.js'

/**
 * PanelLayout
 *
 * Multi-panel grid layout. Each direct child becomes a panel; the layout
 * applies consistent gaps, padding, and an optional scroll containment.
 *
 * Use it for analytics-style dashboards or any view that benefits from a
 * tiled, content-aware arrangement of cards.
 *
 * @example
 *   <PanelLayout columns={3} gap="md">
 *     <Panel>...</Panel>
 *     <Panel>...</Panel>
 *     <Panel>...</Panel>
 *   </PanelLayout>
 */
const COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  'auto': 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
}

const GAPS = {
  none: 'gap-0',
  sm:   'gap-3',
  md:   'gap-4',
  lg:   'gap-6',
  xl:   'gap-8',
}

export function PanelLayout({
  columns = 3,
  gap = 'md',
  as: Tag = 'div',
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn('grid', COLS[columns] ?? COLS[3], GAPS[gap] ?? GAPS.md, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Panel
 *
 * A single tile inside a PanelLayout. Provides a consistent surface,
 * padding, header slot, and optional scroll area.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
export function Panel({
  title,
  description,
  actions,
  scroll = false,
  padded = true,
  className,
  children,
  ...rest
}) {
  return (
    <section
      className={cn(
        'flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-xs',
        className,
      )}
      {...rest}
    >
      {(title || description || actions) ? (
        <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--color-border)]">
          <div className="min-w-0">
            {title ? (
              <h3 className="text-sm font-semibold text-[var(--color-text)] truncate">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-2">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-1 shrink-0">{actions}</div> : null}
        </header>
      ) : null}
      <div
        className={cn(
          padded && 'px-5 py-4',
          scroll && 'overflow-auto',
          'flex-1 min-h-0',
        )}
      >
        {children}
      </div>
    </section>
  )
}

/**
 * PanelRow
 *
 * Convenience for stacking panels with a small gap.
 */
export function PanelRow({ gap = 'md', className, children, ...rest }) {
  return (
    <div className={cn('flex flex-col', GAPS[gap] ?? GAPS.md, className)} {...rest}>
      {children}
    </div>
  )
}
