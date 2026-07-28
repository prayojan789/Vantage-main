import { ArrowUpRight, Layers, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sentimentPill, sentimentColor, fmtRelative } from '../utils/helpers.js'
import { cn } from '../lib/utils.js'
import { StatCard } from './ui/Stat.jsx'
export { StatCard }

export function NewsCard({ event, delay = 0, className }) {
  const { id, title, date, article_count, dominant_sentiment, similarity_score } = event
  const sources = event.sources || []
  const entities = event.entities || []
  const color = sentimentColor(dominant_sentiment)

  return (
    <Link to={`/event/${id}`} className={cn('group block anim-fade-up', className)} style={{ animationDelay: `${delay}s` }}>
      <div className="card-elevated relative h-full overflow-hidden p-5">
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[0.95rem] font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-brand-600)]">{title}</h3>
          <span className={cn('pill', `pill-${dominant_sentiment}`)} style={{ flexShrink: 0 }}>{dominant_sentiment}</span>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          {[1, 0.7, 0.45, 0.25].map((h, i) => (
            <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i === 0 ? color : `linear-gradient(90deg, ${color}66, ${color}11)`, opacity: h }} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1"><Layers size={11} /> {article_count} articles</span>
          <span className="inline-flex items-center gap-1"><Clock size={11} /> {fmtRelative(date)}</span>
          <span className="font-semibold text-[var(--color-brand-600)]">{Math.round(similarity_score * 100)}% match</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(sources).slice(0, 4).map(s => (
            <span key={s} className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text)]">{s}</span>
          ))}
          {(sources).length > 4 ? <span className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text-muted)]">+{sources.length - 4}</span> : null}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--color-border-subtle)] pt-3">
          <div className="flex flex-wrap gap-1.5">{(entities).slice(0, 3).map(e => <span key={e} className="rounded-md bg-[var(--color-brand-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-brand-700)]">{e}</span>)}</div>
          <ArrowUpRight size={16} className="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-brand-600)]" />
        </div>
      </div>
    </Link>
  )
}

export function ArticleCard({ article, className }) {
  return (
    <div className={cn('card-elevated p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text)]">{article.source}</span>
          <span>·</span>
          <span>{fmtRelative(article.published_at)}</span>
        </div>
        <span className={cn('pill', `pill-${article.sentiment}`)}>{article.sentiment}</span>
      </div>
      <h4 className="mt-3 text-[0.95rem] font-semibold leading-snug text-[var(--color-text)]">{article.headline}</h4>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{article.summary}</p>
      {article.entities?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">{article.entities.map(e => <span key={e.name} className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text)]">{e.name}</span>)}</div>
      ) : null}
    </div>
  )
}