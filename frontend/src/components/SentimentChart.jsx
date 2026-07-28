import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { sentimentColor, sentimentPill, sentimentArrow } from '../utils/helpers.js'

export function SentimentChart({ entity }) {
  const { name, sentiment, score } = entity
  const pct = Math.max(0, Math.min(100, Math.round((score ?? 0) * 100)))
  const color = sentimentColor(sentiment)
  const Icon = sentiment === 'positive' ? TrendingUp : sentiment === 'negative' ? TrendingDown : Minus

  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-text)]">{name}</span>
        <span className={sentimentPill(sentiment)} style={{ fontSize: '0.62rem' }}><Icon size={9} /> {pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-sunken)]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
      </div>
      {entity.context ? <p className="mt-1.5 text-[11px] italic leading-relaxed text-[var(--color-text-muted)]">{entity.context}</p> : null}
    </div>
  )
}