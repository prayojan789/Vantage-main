import { forwardRef } from 'react'
import { cn } from '../lib/utils.js'

/**
 * PageContainer
 *
 * A layout primitive that constrains page content to a readable width
 * and provides consistent horizontal padding. Used by AppLayout to wrap
 * the routed page content.
 *
 * Props:
 *   - width: 'default' | 'wide' | 'full'  — max-width of the content column
 *   - flush: boolean — when true, removes horizontal padding (for edge-to-edge pages)
 */
export const PageContainer = forwardRef(function PageContainer(
  {
    width = 'default',
    flush = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const WIDTHS = {
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        WIDTHS[width] ?? WIDTHS.default,
        flush && 'px-0 sm:px-0 lg:px-0',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

export default PageContainer