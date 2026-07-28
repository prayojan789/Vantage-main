import { cn } from '../lib/utils.js'

/**
 * LogoMark
 *
 * A 5-point star with the letter "V" cleanly cut out of the center.
 * The mark is rendered as inline SVG so it inherits `currentColor` and
 * scales crisply at any size.
 *
 * Props:
 *   - size:    pixel size (width = height). Default 18.
 *   - knockout: hex/CSS color used for the "V" cut-out. Default white.
 *   - className: extra classes (e.g. for gradient backgrounds).
 */
export function LogoMark({ size = 18, knockout = '#ffffff', className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('flex-shrink-0', className)}
    >
      {/* 5-point star path */}
      <path d="M12 1.6 L14.78 8.46 L22.2 9.07 L16.55 13.93 L18.34 21.13 L12 17.27 L5.66 21.13 L7.45 13.93 L1.8 9.07 L9.22 8.46 Z" />
      {/* "V" cut out — same fill as the mark's container background */}
      <path
        d="M8.2 9.6 L10.4 9.6 L12 13.4 L13.6 9.6 L15.8 9.6 L12.85 15.6 L11.15 15.6 Z"
        fill={knockout}
      />
    </svg>
  )
}

/**
 * Logo
 *
 * Full brand block — star mark + wordmark + optional tagline.
 * Renders as a <span> by default; wrap in a <Link> as needed.
 *
 * Props:
 *   - size:          pixel size of the mark square. Default 36.
 *   - showWordmark:  show the "Vantage" wordmark + tagline. Default true.
 *   - tagline:       the small uppercase line under the wordmark.
 *   - knockout:      color used to render the inner "V".
 *   - tone:          'gradient' (orange) or 'plain' (white-ish for dark surfaces).
 *   - className:     extra classes on the wrapper.
 */
export default function Logo({
  size = 36,
  showWordmark = true,
  tagline = 'News Intel · NP',
  knockout,
  tone = 'gradient',
  className,
  markClassName,
}) {
  const markSize = Math.round(size * 0.55)
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-lg)] text-white shadow-md transition-transform',
          tone === 'gradient' &&
            'bg-gradient-to-br from-[#f59e0b] to-[#fdba74] shadow-[#f59e0b]/25',
          tone === 'plain' && 'bg-white/15 backdrop-blur-sm shadow-white/10',
          tone === 'solid' && 'bg-[var(--brand-500)]',
        )}
        style={{ width: size, height: size }}
      >
        <LogoMark
          size={markSize}
          knockout={knockout ?? (tone === 'plain' ? '#ffffff' : '#ffffff')}
          className={markClassName}
        />
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight text-[var(--text)]">Vantage</span>
          {tagline ? (
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
              {tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}

