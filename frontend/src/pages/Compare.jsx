/**
 * Compare.jsx — Side-by-side headline comparison
 *
 * Compare news headlines
 */
import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  GitCompareArrows,
  ExternalLink,
  Clock,
  Layers,
  Sparkles,
  Plus,
  X,
  ArrowLeft,
  Newspaper,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENT_DETAIL, MOCK_EVENTS } from '../utils/mockData.js'
import { getEvents, getEventById } from '../services/eventService.js'
import { sentimentColor, sentimentPill, fmtTime, sourceClass } from '../utils/helpers.js'
import { SentimentChart } from '../components/SentimentChart.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cn } from '../lib/utils.js'

const MAX_COLS = 4

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const eventId = params.get('event')
  const [eventList, setEventList] = useState([])
  const [event, setEventData] = useState(null)
  const [activeEventId, setActiveEventId] = useState(eventId || null)
  const [pickedIds, setPickedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load the event list for the picker
  useEffect(() => {
    const load = async () => {
      if (USE_MOCK) {
        setEventList(MOCK_EVENTS.events)
        if (!activeEventId) setActiveEventId(MOCK_EVENT_DETAIL.id)
      } else {
        try {
          const data = await getEvents({ limit: 50 })
          setEventList(data.events)
          if (!activeEventId && data.events.length > 0) setActiveEventId(data.events[0].id)
        } catch (e) { setError(e.message) }
      }
    }
    load()
  }, [])

  // Load the selected event detail
  useEffect(() => {
    if (!activeEventId) return
    const load = async () => {
      setLoading(true); setError(null)
      try {
        let detail
        if (USE_MOCK) {
          detail = String(activeEventId) === String(MOCK_EVENT_DETAIL.id)
            ? MOCK_EVENT_DETAIL
            : (() => {
                const base = MOCK_EVENTS.events.find(e => String(e.id) === String(activeEventId)) || MOCK_EVENTS.events[0]
                return {
                  id: base.id, title: base.title, date: base.date,
                  articles: base.sources.map((s, i) => ({
                    id: `${base.id}_art_${i}`, source: s,
                    headline: `${s.split(' ').slice(0, 3).join(' ')} reports: ${base.title.split(':')[0]}`,
                    url: '#',
                    published_at: new Date(new Date(base.date).getTime() + i * 600000).toISOString(),
                    sentiment: base.dominant_sentiment, sentiment_score: 0.6,
                    entities: (base.entities || []).map(n => ({ name: n, sentiment: base.dominant_sentiment, score: 0.6 })),
                    summary: 'Summary stub for cluster preview.',
                  }))
                }
              })()
        } else {
          detail = await getEventById(activeEventId)
        }
        setEventData(detail)
        setPickedIds(detail.articles.map(a => a.id))
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [activeEventId])

  const articles = event?.articles || []
  const selected = useMemo(
    () => articles.filter(a => pickedIds.includes(a.id)),
    [articles, pickedIds],
  )

  const toggle = (id) => {
    setPickedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= MAX_COLS) return prev
      return [...prev, id]
    })
  }

  const allEntities = useMemo(() => {
    const set = new Set()
    selected.forEach(a => a.entities?.forEach(e => set.add(e.name)))
    return Array.from(set)
  }, [selected])

  const setEvent = (id) => {
    setActiveEventId(id)
    setParams({ event: id })
  }

  if (loading && !event) return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="skeleton h-48" />
      <div className="skeleton h-32" />
      <div className="grid gap-4 sm:grid-cols-3">{[0,1,2].map(i => <div key={i} className="skeleton h-72" />)}</div>
    </div>
  )

  if (error) return (
    <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] px-4 py-3 text-sm text-[var(--red-700)]">
      <AlertCircle size={16} /> {error}
    </div>
  )

  const gridCols = selected.length || 1

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Compare Headlines | Vantage"
        description="Side-by-side comparison of how different Nepali media outlets cover the same event."
      />
      <BackButton to="/events" label="Back to events" />

      <PageHero
        variant="dark"
        eyebrow={<><GitCompareArrows size={11} /> Compare</>}
        title="Headline comparison"
        description="Drop into any clustered event and inspect how up to 4 outlets framed the same story — side-by-side, with entity-level sentiment."
        actions={
          <Button as={Link} to="/events" variant="soft" leftIcon={<ArrowLeft size={14} />} className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25">
            All events
          </Button>
        }
      />

      <div className="card-elevated p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <Layers size={14} /> Pick an event
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {eventList.map(e => (
              <button
                key={e.id}
                onClick={() => setEvent(e.id)}
                className={cn('chip', activeEventId === e.id && 'is-active')}
              >
                <span className="line-clamp-1 max-w-[260px]">{e.title}</span>
                {activeEventId === e.id ? <Check size={12} /> : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-6 py-4">
          <div>
            <p className="eyebrow text-[var(--brand-700)]">{String(event?.id) === String(MOCK_EVENT_DETAIL.id) ? 'Featured cluster' : 'Cluster preview'}</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--text)]">{event?.title}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Clock size={12} /> {event?.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} · {articles.length} articles
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <span className="eyebrow">Articles in this event</span>
          {articles.map(a => {
            const picked = pickedIds.includes(a.id)
            const color = sentimentColor(a.sentiment)
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className={cn(
                  'group inline-flex h-9 items-center gap-2 rounded-[var(--radius-lg)] border px-3 text-xs font-semibold transition-all',
                  picked
                    ? 'border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--brand-200)]',
                )}
                style={picked ? { borderLeft: `3px solid ${color}` } : undefined}
              >
                <span className={cn('source-tag', sourceClass(a.source))}>{a.source}</span>
                <span className="line-clamp-1 max-w-[180px]">{a.headline}</span>
                {picked ? <X size={12} /> : <Plus size={12} />}
              </button>
            )
          })}
        </div>
      </div>

      {selected.length === 0 ? (
        <EmptyState
          icon={GitCompareArrows}
          title="Pick at least one article"
          description="Click on article chips above to add them to the comparison grid."
        />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {selected.map((a, i) => (
            <article
              key={a.id}
              className="card-elevated flex flex-col overflow-hidden anim-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${sentimentColor(a.sentiment)}, ${sentimentColor(a.sentiment)}66)` }}
              />
              <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
                <span className={cn('source-tag', sourceClass(a.source))}>{a.source}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                  <Clock size={11} /> {fmtTime(a.published_at)}
                </span>
              </header>

              <div className="flex-1 space-y-4 p-5">
                <h3 className="text-base font-semibold leading-snug text-[var(--text)]">
                  {a.headline}
                </h3>

                <div className="flex items-center gap-2">
                  <SentimentIcon s={a.sentiment} />
                  <span className={sentimentPill(a.sentiment)}>{a.sentiment}</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {Math.round((a.sentiment_score ?? 0.5) * 100)}% confidence
                  </span>
                </div>

                <div
                  className="rounded-xl border-l-4 bg-[var(--surface-muted)] p-3 text-sm leading-relaxed text-[var(--text)]"
                  style={{ borderLeftColor: sentimentColor(a.sentiment) }}
                >
                  {a.summary}
                </div>

                <div>
                  <p className="eyebrow mb-3">Entity sentiment</p>
                  <div className="space-y-2.5">
                    {a.entities?.map(e => <SentimentChart key={e.name} entity={e} />)}
                  </div>
                </div>
              </div>

              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 border-t border-[var(--border-subtle)] bg-[var(--surface)] text-sm font-semibold text-[var(--brand-600)] transition-colors hover:bg-[var(--brand-50)]"
              >
                <ExternalLink size={13} /> Read original
              </a>
            </article>
          ))}
        </div>
      )}

      {allEntities.length > 0 && selected.length > 1 ? (
        <section className="card-elevated overflow-hidden">
          <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-6 py-4">
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Entity divergence matrix</p>
              <h2 className="mt-1 text-base font-bold text-[var(--text)]">How each entity is treated across selected articles</h2>
            </div>
            <span className="text-xs text-[var(--text-muted)]">{allEntities.length} entities · {selected.length} sources</span>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="px-6 py-3 text-left">Entity</th>
                  {selected.map(a => (
                    <th key={a.id} className="px-3 py-3 text-left">
                      <span className={cn('source-tag', sourceClass(a.source))}>{a.source}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allEntities.map(name => (
                  <tr key={name} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="px-6 py-3 font-semibold text-[var(--text)]">{name}</td>
                    {selected.map(a => {
                      const e = a.entities?.find(x => x.name === name)
                      if (!e) return <td key={a.id} className="px-3 py-3 text-xs text-[var(--text-muted)]">—</td>
                      return (
                        <td key={a.id} className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <SentimentIcon s={e.sentiment} />
                            <span className={sentimentPill(e.sentiment)} style={{ fontSize: '0.6rem' }}>{e.sentiment}</span>
                            <span className="text-[11px] text-[var(--text-muted)]">{Math.round((e.score ?? 0.5) * 100)}%</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {selected.length > 1 ? (
        <section className="card-elevated overflow-hidden border-[var(--brand-200)]">
          <header className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--brand-50)]/60 px-6 py-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-600)] text-white">
              <Sparkles size={14} />
            </span>
            <div>
              <p className="eyebrow text-[var(--brand-700)]">AI Synthesis</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Differences the model detects</h2>
            </div>
          </header>
          <div className="space-y-4 p-6 text-sm text-[var(--text-soft)]">
            <p className="leading-relaxed">
              Across the {selected.length} selected articles, the model identifies
              {' '}<strong className="text-[var(--text)]">{allEntities.length} entities</strong>{' '}
              with measurable sentiment divergence. The strongest negative framing
              appears in <strong className="text-[var(--text)]">{selected.find(a => a.sentiment === 'negative')?.source ?? '—'}</strong>,
              while the strongest positive coverage comes from
              {' '}<strong className="text-[var(--text)]">{selected.find(a => a.sentiment === 'positive')?.source ?? '—'}</strong>.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Dominant narrative</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">Instability vs. democratic process</p>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Key divergence</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">Framing of RSP as "reformist" vs "opportunist"</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function SentimentIcon({ s }) {
  if (s === 'positive') return <TrendingUp size={12} className="text-[var(--green-600)]" />
  if (s === 'negative') return <TrendingDown size={12} className="text-[var(--red-600)]" />
  return <Minus size={12} className="text-[var(--yellow-600)]" />
}
