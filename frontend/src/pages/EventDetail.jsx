/**
 * EventDetail.jsx — Single event detail
 */
import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  AlertCircle, Calendar, GitBranch, Clock, Sparkles, Network,
  Building2, ArrowRight,
} from 'lucide-react'
import ClusterView from '../components/ClusterView.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENT_DETAIL } from '../utils/mockData.js'
import { getEventById } from '../services/eventService.js'
import { fmtDate, sentimentPill, sentimentColor } from '../utils/helpers.js'
import PageHero from '../components/PageHero.jsx'
import { SourceBadge } from '../components/Charts.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cn } from '../lib/utils.js'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null)
      try {
        setEvent(USE_MOCK ? MOCK_EVENT_DETAIL : await getEventById(id))
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const sentCounts = event?.articles?.reduce((a, art) => {
    a[art.sentiment] = (a[art.sentiment] || 0) + 1; return a
  }, {})

  const timelineEvents = useMemo(
    () => event?.articles?.slice().sort((a, b) => new Date(a.published_at) - new Date(b.published_at)) || [],
    [event],
  )

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title={event ? `${event.title} | Vantage` : 'Event Detail | Vantage'}
        description="Compare multiple articles covering the same event and inspect sentiment, framing, and entity treatment."
      />

      <BackButton to="/events" label="Back to events" />

      {error ? (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] px-4 py-3 text-sm text-[var(--red-700)]">
          <AlertCircle size={16} /> {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map(i => <div key={i} className="skeleton h-72" />)}
          </div>
        </div>
      ) : !event ? null : (
        <>
          <PageHero
            variant="gradient"
            eyebrow={<><GitBranch size={11} /> Event cluster</>}
            title={event.title}
            description={`${event.articles.length} articles from ${[...new Set(event.articles.map(a => a.source))].length} Nepali outlets, compared side-by-side.`}
            actions={
              <Button
                as={Link}
                to="/compare"
                variant="soft"
                leftIcon={<GitBranch size={14} />}
                className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25"
              >
                Compare view
              </Button>
            }
            visual={
              <div className="flex flex-wrap items-center gap-3">
                {Object.entries(sentCounts || {}).map(([s, n]) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: sentimentColor(s) }} />
                    {n}× {s}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <Calendar size={12} /> {fmtDate(event.date)}
                </span>
              </div>
            }
          />

          <div className="card-elevated flex items-start gap-3 p-4">
            <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-600)] text-white">
              <Sparkles size={16} />
            </span>
            <p className="text-sm leading-relaxed text-[var(--text-soft)]">
              <strong className="text-[var(--text)]">Same event, different narratives.</strong>{' '}
              Each column below shows how a different outlet framed this story. Compare entity sentiment rows to spot systematic differences in how political actors are covered.
            </p>
          </div>

          <ClusterView articles={event.articles} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-elevated p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--brand-600)]" />
                  <h2 className="section-title">AI Synthesis</h2>
                </div>
                <p className="rounded-xl border-l-4 border-[var(--brand-500)] bg-[var(--surface-muted)] p-4 text-sm italic leading-relaxed text-[var(--text-soft)]">
                  "This event represents a critical juncture in coalition politics. While {event.articles[0]?.source} emphasizes the instability and crisis, {event.articles[1]?.source} frames it as a routine democratic transition. The most significant divergence is the treatment of {event.articles[0]?.entities[0]?.name}."
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Dominant narrative</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--text)]">Coalition Instability vs. Democratic Process</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Key divergence</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--text)]">Framing of RSP as 'Reformist' vs 'Opportunist'</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-[var(--brand-600)]" />
                  <h2 className="section-title">Event timeline</h2>
                </div>
                <div className="relative space-y-6 border-l-2 border-[var(--border)] pl-6">
                  {timelineEvents.map(art => (
                    <div key={art.id} className="relative">
                      <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[var(--brand-500)] bg-[var(--surface)]" />
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold text-[var(--text-muted)]">{fmtDate(art.published_at)}</span>
                          <SourceBadge name={art.source} />
                        </div>
                        <p className="text-sm font-medium text-[var(--text)]">{art.headline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-elevated flex flex-col items-center justify-center space-y-3 border-dashed p-6 text-center">
                <div className="rounded-full bg-[var(--brand-50)] p-3 text-[var(--brand-600)]">
                  <Network size={28} />
                </div>
                <h3 className="text-sm font-bold text-[var(--text)]">Entity Relationship Graph</h3>
                <p className="text-xs text-[var(--text-muted)]">Visualizing connections between actors in this event.</p>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Coming Soon
                </span>
              </div>

              <div className="card-elevated p-5">
                <p className="eyebrow mb-3 text-[var(--brand-700)]">Sources in this cluster</p>
                <div className="space-y-2">
                  {[...new Set(event.articles.map(a => a.source))].map(s => (
                    <div key={s} className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-2.5">
                      <SourceBadge name={s} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--text)]">{s}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {event.articles.filter(a => a.source === s).length} article{event.articles.filter(a => a.source === s).length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <p className="eyebrow mb-2 text-[var(--brand-700)]">Entity divergence summary</p>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              How each political entity is treated across all {event.articles.length} articles covering this event.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...new Set(event.articles.flatMap(a => (a.entities || []).map(e => e.name)))].map(name => {
                const mentions = event.articles.flatMap(a => (a.entities || []).filter(e => e.name === name))
                const validScores = mentions.map(e => e.score ?? 0.5)
                const avgScore = validScores.length ? validScores.reduce((s, v) => s + v, 0) / validScores.length : 0.5
                const sent = avgScore > 0.6 ? 'positive' : avgScore < 0.4 ? 'negative' : 'neutral'
                return (
                  <div key={name} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--text)]">{name}</span>
                      <span className={sentimentPill(sent)} style={{ fontSize: '0.6rem' }}>{sent}</span>
                    </div>
                    <div className="space-y-1.5">
                      {mentions.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                          <span className="w-20 flex-shrink-0 truncate">{m.sentiment}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(m.score ?? 0.5) * 100}%`, background: sentimentColor(m.sentiment) }}
                            />
                          </div>
                          <span className="font-mono">{Math.round((m.score ?? 0.5) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
