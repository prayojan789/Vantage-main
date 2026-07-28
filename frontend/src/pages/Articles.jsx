/**
 * Articles.jsx — Article archive
 */
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
  Database,
  BarChart3,
  Award,
  ExternalLink,
  Clock,
  Newspaper,
  Filter,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES, MOCK_EVENT_DETAIL } from '../utils/mockData.js'
import { getEvents } from '../services/eventService.js'
import { getSources } from '../services/sourceService.js'
import { sentimentPill, sourceClass, fmtRelative, fmtTime } from '../utils/helpers.js'
import { StatCard } from '../components/DashboardComponents.jsx'
import { SourceBadge } from '../components/Charts.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, InputGroup, InputLeftElement } from '../components/ui/Input.jsx'
import { cn } from '../lib/utils.js'

function deriveArticlesFromEvents(events) {
  return events.map(ev => {
    // When real data is available, ev.articles is populated directly from the API
    if (ev.articles?.length) {
      const articles = ev.articles.map(a => ({
        ...a,
        tags: ['Politics', 'Nepal', 'Analysis'],
        publisher_info: { location: 'Kathmandu', verified: true, reach: 'High' },
      }))
      return { event: ev, articles }
    }
    // Fallback stub for mock / events with no article detail
    const sources = ev.sources?.length ? ev.sources : MOCK_SOURCES.sources.slice(0, 2)
    const sent = ev.dominant_sentiment
    const score = sent === 'negative' ? 0.78 : sent === 'positive' ? 0.71 : 0.52
    const offsetMs = (i) => i * 1000 * 60 * 45
    const articles = sources.slice(0, 2).map((src, i) => ({
      id: `${ev.id}_art_${i + 1}`,
      source: src,
      headline: i === 0
        ? `${ev.title.split(':')[0]} — ${ev.sources?.length || 'multiple'} outlets report`
        : `Analysis: ${ev.title.split(' ').slice(0, 6).join(' ')}…`,
      url: '#',
      published_at: new Date(new Date(ev.date).getTime() - offsetMs(i)).toISOString(),
      sentiment: sent,
      sentiment_score: score,
      entities: (ev.entities || []).slice(0, 2).map(name => ({ name, sentiment: sent, score })),
      summary: 'Auto-derived summary stub for the article archive view.',
      tags: ['Politics', 'Nepal', 'Analysis'],
      publisher_info: { location: 'Kathmandu', verified: true, reach: 'Medium' },
    }))
    return { event: ev, articles }
  })
}

export default function Articles() {
  const [eventGroups, setEventGroups] = useState([])
  const [sources, setSources]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [search, setSearch]           = useState('')
  const [sourceFilter, setSource]     = useState('all')
  const [sentFilter, setSent]         = useState('all')

  const load = async () => {
    setLoading(true); setError(null)
    try {
      let evtData, srcData
      if (USE_MOCK) { evtData = MOCK_EVENTS; srcData = MOCK_SOURCES }
      else {
        [evtData, srcData] = await Promise.all([
          getEvents({ source: sourceFilter === 'all' ? undefined : sourceFilter }),
          getSources(),
        ])
      }
      setEventGroups(deriveArticlesFromEvents(evtData.events))
      setSources(srcData.sources)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [sourceFilter])

  const allArticles = useMemo(
    () => eventGroups.flatMap(g => g.articles.map(a => ({ ...a, _eventId: g.event.id, _eventTitle: g.event.title }))),
    [eventGroups],
  )

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase()
    return eventGroups
      .map(g => {
        const articles = g.articles.filter(a => {
          const matchesQ = !q
            || a.headline.toLowerCase().includes(q)
            || a.source.toLowerCase().includes(q)
            || g.event.title.toLowerCase().includes(q)
          const matchesSent = sentFilter === 'all' || a.sentiment === sentFilter
          const matchesSrc = sourceFilter === 'all' || a.source === sourceFilter
          return matchesQ && matchesSent && matchesSrc
        })
        return { ...g, articles }
      })
      .filter(g => g.articles.length > 0)
  }, [eventGroups, search, sentFilter, sourceFilter])

  const stats = useMemo(() => {
    const total = allArticles.length
    const sourceSet = new Set(allArticles.map(a => a.source))
    const sentCounts = { positive: 0, negative: 0, neutral: 0 }
    allArticles.forEach(a => sentCounts[a.sentiment]++)
    const sourceCounts = {}
    allArticles.forEach(a => { sourceCounts[a.source] = (sourceCounts[a.source] || 0) + 1 })
    const topEntry = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]
    return [
      { label: 'Total articles',   value: String(total),                  sub: `Across ${eventGroups.length} clusters`, icon: FileText, accent: 'brand' },
      { label: 'Sources covered',  value: String(sourceSet.size),         sub: 'Unique outlets',                     icon: Database, accent: 'blue' },
      { label: 'Sentiment split',  value: `${sentCounts.positive}/${sentCounts.neutral}/${sentCounts.negative}`, sub: 'Pos / Neu / Neg', icon: BarChart3, accent: 'green' },
      { label: 'Most active',      value: topEntry ? topEntry[0].split(' ').slice(0, 2).join(' ') : '—', sub: topEntry ? `${topEntry[1]} articles` : 'No data', icon: Award, accent: 'purple' },
    ]
  }, [allArticles, eventGroups])

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Article Archive | Vantage"
        description="Browse every individual article across all clustered events, filterable by source, sentiment, and search query."
      />

      <PageHero
        variant="gradient"
        eyebrow={<><Newspaper size={11} /> Article archive</>}
        title="Every article, in one place"
        description="Every individual article that fed into our event clusters. Search by headline or source, filter by sentiment, and dig into the raw coverage behind each story."
        actions={
          <Button
            variant="soft"
            leftIcon={<RefreshCw size={14} className={loading ? 'anim-spin' : ''} />}
            onClick={load}
            className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25"
          >
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card-elevated p-4">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="min-w-[240px] flex-1">
            <InputLeftElement><Search size={14} /></InputLeftElement>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles, sources, or events…" variant="filled" />
          </InputGroup>
          <select value={sourceFilter} onChange={e => setSource(e.target.value)} className="field-input h-10 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-sm font-semibold">
            <option value="all">All sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-1.5">
            {['all', 'positive', 'neutral', 'negative'].map(s => (
              <button
                key={s}
                onClick={() => setSent(s)}
                className={cn(
                  'inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-lg)] border px-3 text-xs font-semibold capitalize transition-all',
                  sentFilter === s
                    ? 'border-[var(--brand-500)] bg-[var(--brand-500)] text-white shadow-sm'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--brand-300)] hover:text-[var(--text)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] px-4 py-3 text-sm text-[var(--red-700)]">
          <AlertCircle size={16} /> {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => <div key={i} className="skeleton h-32" />)}
        </div>
      ) : filteredGroups.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No articles match your filters"
          description="Try clearing filters or searching for a different term."
          action={<Button variant="outline" onClick={() => { setSearch(''); setSent('all'); setSource('all') }}>Reset</Button>}
        />
      ) : (
        <div className="space-y-6">
          {filteredGroups.map(g => (
            <section key={g.event.id} className="card-elevated overflow-hidden">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('source-tag', sourceClass(g.event.sources?.[0] || ''))}>Cluster</span>
                    <Link
                      to={`/event/${g.event.id}`}
                      className="text-base font-bold text-[var(--text)] hover:text-[var(--brand-600)]"
                    >
                      {g.event.title}
                    </Link>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    {g.articles.length} article{g.articles.length === 1 ? '' : 's'} · {fmtRelative(g.event.date)} · {(g.event.sources || []).length} sources
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {g.event.entities?.slice(0, 4).map(en => (
                    <span key={en} className="rounded-md bg-[var(--brand-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-700)]">{en}</span>
                  ))}
                </div>
              </header>
              <div className="divide-y divide-[var(--border-subtle)]">
                {g.articles.map(a => (
                  <article
                    key={a.id}
                    className="flex flex-col gap-3 p-5 transition-colors hover:bg-[var(--surface-muted)] sm:flex-row sm:items-start"
                  >
                    <div className="flex items-start gap-3 sm:w-72 sm:flex-shrink-0">
                      <SourceBadge name={a.source} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{a.source}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Kathmandu · Verified</p>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={10} /> {fmtTime(a.published_at)}
                        </span>
                        <span className={sentimentPill(a.sentiment)} style={{ fontSize: '0.6rem' }}>{a.sentiment}</span>
                        <span className="font-semibold text-[var(--text-muted)]">{Math.round((a.sentiment_score ?? 0.5) * 100)}% confidence</span>
                      </div>
                      <h4 className="mt-1 text-sm font-semibold leading-snug text-[var(--text)]">{a.headline}</h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">{a.summary}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {a.tags?.map(t => (
                          <span key={t} className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">#{t}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--brand-300)] hover:text-[var(--brand-600)] sm:self-center"
                    >
                      <ExternalLink size={12} /> Original
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
