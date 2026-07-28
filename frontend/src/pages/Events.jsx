/**
 * Events.jsx — Event clusters archive
 *
 * View clustered events
 */
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  AlertCircle,
  Layers,
  Newspaper,
  Activity,
  TrendingUp,
  Building2,
  Filter,
  Grid3x3,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowUpDown,
  Calendar,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { getEvents } from '../services/eventService.js'
import { getSources } from '../services/sourceService.js'
import { NewsCard, StatCard } from '../components/DashboardComponents.jsx'
import { SentimentDonut, SourceBadge } from '../components/Charts.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, InputGroup, InputLeftElement } from '../components/ui/Input.jsx'
import { sentimentColor, fmtDate } from '../utils/helpers.js'
import { cn } from '../lib/utils.js'

const SORTS = [
  { key: 'date',     label: 'Latest' },
  { key: 'articles', label: 'Most covered' },
  { key: 'match',    label: 'Highest match' },
]

export default function Events() {
  const [events, setEvents]     = useState([])
  const [sources, setSources]   = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [sourceFilter, setSource] = useState('all')
  const [sentFilter, setSent]     = useState('all')
  const [viewMode, setViewMode]   = useState('grid')
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

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
      setEvents(evtData.events); setTotal(evtData.total); setSources(srcData.sources)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [sourceFilter])

  const stats = useMemo(() => {
    const totalArticles = events.reduce((acc, e) => acc + (e.article_count || 0), 0)
    const avg = events.length ? +(totalArticles / events.length).toFixed(1) : 0
    const sourceCounts = {}
    events.forEach(e => e.sources?.forEach(s => { sourceCounts[s] = (sourceCounts[s] || 0) + 1 }))
    const topEntry = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]
    return [
      { label: 'Total events',    value: String(events.length),   sub: `${total} tracked overall`,         icon: Layers,    accent: 'brand' },
      { label: 'Total articles',  value: String(totalArticles),   sub: `Across ${events.length} clusters`, icon: Newspaper, accent: 'blue' },
      { label: 'Avg / event',     value: String(avg),             sub: 'Articles per cluster',            icon: Activity,  accent: 'green' },
      { label: 'Top source',      value: topEntry ? topEntry[0].split(' ').slice(0, 2).join(' ') : '—', sub: topEntry ? `${topEntry[1]} events` : 'No data', icon: Building2, accent: 'purple' },
    ]
  }, [events, total])

  const sentCounts = useMemo(() => {
    const c = { positive: 0, negative: 0, neutral: 0 }
    events.forEach(e => { if (e.dominant_sentiment in c) c[e.dominant_sentiment]++ })
    return c
  }, [events])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return events.filter(e => {
      const matchQ = !q || e.title.toLowerCase().includes(q) || e.entities?.some(x => x.toLowerCase().includes(q))
      const matchS = sentFilter === 'all' || e.dominant_sentiment === sentFilter
      const matchSrc = sourceFilter === 'all' || (e.sources || []).includes(sourceFilter)
      return matchQ && matchS && matchSrc
    })
  }, [events, search, sentFilter, sourceFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1
      if (sortConfig.key === 'date')     return (new Date(a.date) - new Date(b.date)) * dir
      if (sortConfig.key === 'articles') return ((a.article_count || 0) - (b.article_count || 0)) * dir
      if (sortConfig.key === 'match')    return ((a.similarity_score || 0) - (b.similarity_score || 0)) * dir
      return 0
    })
    return arr
  }, [filtered, sortConfig])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sorted.slice(start, start + itemsPerPage)
  }, [sorted, currentPage])

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage))
  const handleSort = (key) => setSortConfig(prev => ({
    key,
    direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
  }))

  const SENT_PILLS = [
    { key: 'all',      label: 'All',      count: events.length,   color: 'var(--brand-500)' },
    { key: 'positive', label: 'Positive', count: sentCounts.positive, color: 'var(--pos)' },
    { key: 'neutral',  label: 'Neutral',  count: sentCounts.neutral,  color: 'var(--neu)' },
    { key: 'negative', label: 'Negative', count: sentCounts.negative, color: 'var(--neg)' },
  ]

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Event Clusters | Vantage"
        description="Browse all clustered news events from Nepali English outlets, filterable by source, sentiment and search query."
      />

      <PageHero
        variant="gradient"
        eyebrow={<><Layers size={11} /> Clustered events</>}
        title="Event clusters archive"
        description="Every event we've clustered, in one place. Stories are grouped by semantic similarity across 7 Nepali English outlets, refreshed every five minutes."
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
        visual={
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <SentimentDonut
              positive={sentCounts.positive}
              neutral={sentCounts.neutral}
              negative={sentCounts.negative}
              size={120}
              thickness={16}
            />
            <div className="grid grid-cols-3 gap-6 text-white">
              {[
                { label: 'Positive', value: sentCounts.positive, color: 'bg-emerald-400' },
                { label: 'Neutral',  value: sentCounts.neutral,  color: 'bg-amber-400'   },
                { label: 'Negative', value: sentCounts.negative, color: 'bg-rose-400'    },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                  <span className={cn('mt-1 inline-block h-1 w-8 rounded-full', s.color)} />
                </div>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
      </div>

      <div className="card-elevated p-4">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="min-w-[240px] flex-1">
            <InputLeftElement><Search size={14} /></InputLeftElement>
            <Input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} placeholder="Search events, entities, or keywords…" variant="filled" />
          </InputGroup>

          <select value={sourceFilter} onChange={e => { setSource(e.target.value); setCurrentPage(1) }} className="field-input h-10 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-sm font-semibold">
            <option value="all">All sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="flex h-10 items-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors', viewMode === 'grid' ? 'bg-[var(--brand-500)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]')}
              aria-label="Grid view"
            >
              <Grid3x3 size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn('inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors', viewMode === 'table' ? 'bg-[var(--brand-500)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]')}
              aria-label="List view"
            >
              <ListIcon size={14} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[var(--border-subtle)] pt-3">
          <Filter size={12} className="text-[var(--text-muted)]" />
          {SENT_PILLS.map(p => {
            const active = sentFilter === p.key
            return (
              <button
                key={p.key}
                onClick={() => { setSent(p.key); setCurrentPage(1) }}
                className={cn('chip', active && 'is-active')}
              >
                {p.color ? <span className="h-2 w-2 rounded-full" style={{ background: p.color }} /> : null}
                {p.label}
                <span className={cn('rounded-md px-1 text-[10px] font-bold', active ? 'bg-white/25 text-white' : 'bg-[var(--surface-sunken)] text-[var(--text-muted)]')}>
                  {p.count}
                </span>
              </button>
            )
          })}

          <span className="ml-auto text-xs text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">{filtered.length}</strong> of {events.length} events
          </span>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] px-4 py-3 text-sm text-[var(--red-700)]">
          <AlertCircle size={16} /> {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-56" />)}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No events match your filters"
          description="Try clearing filters or searching for a different term."
          action={<Button variant="outline" onClick={() => { setSearch(''); setSent('all'); setSource('all') }}>Reset filters</Button>}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((ev, i) => <NewsCard key={ev.id} event={ev} delay={i * 0.04} />)}
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-3 py-3 text-left">
                  <button onClick={() => handleSort('articles')} className="inline-flex items-center gap-1 hover:text-[var(--text)]">
                    Articles <ArrowUpDown size={10} />
                  </button>
                </th>
                <th className="px-3 py-3 text-left">Sentiment</th>
                <th className="px-3 py-3 text-left">Sources</th>
                <th className="px-3 py-3 text-left">
                  <button onClick={() => handleSort('date')} className="inline-flex items-center gap-1 hover:text-[var(--text)]">
                    Date <ArrowUpDown size={10} />
                  </button>
                </th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(ev => (
                <tr key={ev.id} className="border-b border-[var(--border-subtle)] transition-colors last:border-0 hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--text)]">{ev.title}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(ev.entities || []).slice(0, 3).map(en => (
                          <span key={en} className="rounded-md bg-[var(--brand-50)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-700)]">
                            {en}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{ev.article_count}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize" style={{
                      background: `${sentimentColor(ev.dominant_sentiment)}1A`,
                      color: sentimentColor(ev.dominant_sentiment),
                    }}>
                      {ev.dominant_sentiment}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex -space-x-1.5">
                      {ev.sources.slice(0, 4).map(s => (
                        <SourceBadge key={s} name={s} className="ring-2 ring-[var(--surface)]" />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} /> {fmtDate(ev.date)}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      to={`/event/${ev.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-600)] hover:underline"
                    >
                      Open <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && sorted.length > 0 ? (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            Page <strong className="text-[var(--text)]">{currentPage}</strong> of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--brand-300)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-xs font-semibold transition-colors',
                  currentPage === i + 1
                    ? 'bg-[var(--brand-500)] text-white shadow-sm'
                    : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--brand-300)] hover:text-[var(--text)]',
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--brand-300)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
