import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock, Tag } from 'lucide-react'
import { sentimentPill, fmtRelative, sourceClass } from '../utils/helpers.js'
import { SourceBadge } from './Charts.jsx'
import { cn } from '../lib/utils.js'

export default function NewsCardCompact({ event, delay = 0, className }) {
  return (
    <Link to={`/event/${event.id}`} className={cn('group flex items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all hover:border-[var(--color-brand-200)] hover:shadow-sm anim-fade-up', className)} style={{ animationDelay: `${delay}s` }}>
      <SourceBadge name={event.sources?.[0]} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text)]">{event.sources?.[0]}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock size={10} /> {fmtRelative(event.date)}</span>
        </div>
        <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-brand-600)]">{event.title}</h4>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
          <span className={sentimentPill(event.dominant_sentiment)} style={{ fontSize: '0.6rem' }}>{event.dominant_sentiment}</span>
          <span>{event.article_count} articles</span>
          <span className="font-semibold text-[var(--color-brand-600)]">{Math.round(event.similarity_score * 100)}% match</span>
        </div>
      </div>
      <ArrowUpRight size={14} className="mt-1 text-[var(--color-text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}