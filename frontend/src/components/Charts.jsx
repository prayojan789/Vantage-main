import { useMemo } from 'react'
import { cn } from '../lib/utils.js'

/**
 * Charts — small inline visualisation primitives
 *
 *  - Sparkline: a tiny SVG line chart for KPI cards
 *  - SentimentDonut: a three-segment donut chart
 *  - BarList: a horizontal bar list with labels and values
 *  - ActivityFeed: a vertical feed of timestamped activity items
 *  - SourceBadge: a small publisher logo / abbreviation badge
 *  - TrendBadge: a pill that shows the trend direction
 *
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */

export function Sparkline({
  data = [],
  color = 'var(--color-brand-500)',
  height = 40,
  width = 120,
  showArea = true,
  className,
}) {
  const { path, area, points } = useMemo(() => {
    if (!data.length) return { path: '', area: '', points: [] }
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const stepX = width / Math.max(data.length - 1, 1)
    const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 6) - 3])
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`
    return { path: pathD, area: areaD, points: pts }
  }, [data, width, height])

  if (!data.length) return null
  const gradId = `spark-${Math.random().toString(36).slice(2, 9)}`

  return (
    <svg
      className={cn('block', className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea ? <path d={area} fill={`url(#${gradId})`} /> : null}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.length > 0 ? (
        <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={color} />
      ) : null}
    </svg>
  )
}

export function SentimentDonut({
  positive = 0,
  negative = 0,
  neutral = 0,
  size = 120,
  thickness = 14,
  className,
}) {
  const total = positive + negative + neutral
  const segments = [
    { value: positive, color: 'var(--color-sentiment-positive)', label: 'Positive' },
    { value: neutral,  color: 'var(--color-sentiment-neutral)',  label: 'Neutral' },
    { value: negative, color: 'var(--color-sentiment-negative)', label: 'Negative' },
  ]
  if (total === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]',
          className,
        )}
        style={{ width: size, height: size }}
      >
        No data
      </div>
    )
  }
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let offset = 0

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * c
          const dash = `${len} ${c - len}`
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none text-[var(--color-text)] tabular-nums">{total}</span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">articles</span>
      </div>
    </div>
  )
}

export function BarList({ items = [], className }) {
  if (!items.length) return null
  const max = Math.max(...items.map(i => i.value)) || 1
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((it, i) => (
        <li key={i} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--color-text)]">{it.label}</span>
            <span className="font-semibold text-[var(--color-text-muted)] tabular-nums">{it.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-sunken)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(it.value / max) * 100}%`,
                background: it.color || 'var(--color-brand-500)',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ActivityFeed({ items = [], className }) {
  return (
    <ul className={cn('flex flex-col', className)}>
      {items.map((it, i) => {
        const Icon = it.icon
        const tone = it.tone || 'primary'
        const toneClasses = {
          primary:  'bg-[var(--color-brand-50)]  text-[var(--color-brand-600)]',
          positive: 'bg-[var(--color-success-bg)]  text-[var(--color-success)]',
          negative: 'bg-[var(--color-danger-bg)]    text-[var(--color-danger)]',
          warning:  'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
        }[tone] || 'bg-[var(--color-brand-50)] text-[var(--color-brand-600)]'

        return (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  toneClasses,
                )}
              >
                {Icon ? <Icon size={14} /> : null}
              </div>
              {i < items.length - 1 ? (
                <div className="mt-1 w-px flex-1 bg-[var(--color-border)]" />
              ) : null}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--color-text)]">{it.title}</p>
                <span className="text-[10px] text-[var(--color-text-muted)]">{it.time}</span>
              </div>
              {it.detail ? (
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{it.detail}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const palette = {
  'The Kathmandu Post':   { bg: 'bg-[var(--color-brand-50)]',    fg: 'text-[var(--color-brand-700)]' },
  'Republica':            { bg: 'bg-[var(--color-brand-50)]',    fg: 'text-[var(--color-brand-700)]' },
  'OnlineKhabar English': { bg: 'bg-[var(--color-brand-50)]',    fg: 'text-[var(--color-brand-700)]' },
  'The Himalayan Times':  { bg: 'bg-[var(--color-success-bg)]',  fg: 'text-[var(--color-success)]' },
  'My Republica':         { bg: 'bg-[var(--color-purple-50)]',   fg: 'text-[var(--color-purple-600)]' },
  'Setopati English':     { bg: 'bg-[var(--color-pink-50)]',     fg: 'text-[var(--color-pink-600)]' },
  'Nepal Monitor':        { bg: 'bg-[var(--color-cyan-50)]',     fg: 'text-[var(--color-cyan-600)]' },
}

export function SourceBadge({ name, size = 'sm', className }) {
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase()
  const c = palette[name] || { bg: 'bg-[var(--color-surface-muted)]', fg: 'text-[var(--color-text)]' }

  const sizes = {
    xs: 'h-6 w-6 text-[0.6rem]',
    sm: 'h-7 w-7 text-[0.65rem]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md font-bold uppercase tracking-wider',
        c.bg,
        c.fg,
        sizes[size] || sizes.sm,
        className,
      )}
      title={name}
    >
      {initials}
    </span>
  )
}

export function TrendBadge({ direction, value, className }) {
  if (direction === 'up') {
    return (
      <span className={cn('inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-success)]', className)}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 9L6 4L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {value}
      </span>
    )
  }
  if (direction === 'down') {
    return (
      <span className={cn('inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-danger)]', className)}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 9L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {value}
      </span>
    )
  }
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)]', className)}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {value}
    </span>
  )
}
