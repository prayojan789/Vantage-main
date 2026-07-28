/**
 * Search.jsx — Global search
 *
 * Search articles
 */
import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search as SearchIcon,
  Sparkles,
  Layers,
  Newspaper,
  User,
  Clock,
  X,
  TrendingUp,
  Hash,
  ArrowUpRight,
  Command,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, InputGroup, InputLeftElement } from '../components/ui/Input.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { getEvents } from '../services/eventService.js'
import { getSources } from '../services/sourceService.js'
import { sentimentPill, fmtRelative, sourceClass } from '../utils/helpers.js'
import { cn } from '../lib/utils.js'

const FILTERS = [
  { id: 'all',      label: 'All',      icon: Sparkles },
  { id: 'events',   label: 'Events',   icon: Layers },
  { id: 'articles', label: 'Articles', icon: Newspaper },
  { id: 'entities', label: 'Entities', icon: User },
]

const SORTS = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'recent',    label: 'Most recent' },
]

function buildSyntheticArticles(events) {
  return events.flatMap(ev =>
    (ev.sources || []).slice(0, 2).map((src, idx) => {
      const topic = ev.title.split(':')[0].split('?')[0]
      const variant = idx === 0
        ? `${src}: ${topic.toLowerCase()} — what it means for Kathmandu`
        : `Opinion: Inside the ${topic.toLowerCase()} debate`
      return {
        id: `${ev.id}__art_${idx}`,
        headline: variant,
        source: src,
        date: ev.date,
        sentiment: ev.dominant_sentiment,
        eventId: ev.id,
      }
    })
  )
}

function buildEntityPool(events) {
  return Array.from(new Set(events.flatMap(e => e.entities || []))).sort()
}

function buildEntityEventIndex(events, pool) {
  return pool.reduce((acc, name) => {
    acc[name] = events.filter(e => (e.entities || []).includes(name))
    return acc
  }, {})
}

const TYPE_META = {
  event:   { label: 'Event',   tone: 'brand',  icon: Layers },
  article: { label: 'Article', tone: 'orange', icon: Newspaper },
  entity:  { label: 'Entity',  tone: 'gray',   icon: User },
}

const RECENT_SEARCHES = ['KP Oli', 'Cabinet reshuffle', 'World Bank GDP', 'Election Commission', 'Nepal Rastra Bank']
const TRENDING = ['KP Oli', 'RSP', 'Balen Shah', 'PM Dahal', 'Coalition', 'UML congress', 'Budget 2026', 'Election threshold']

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') || ''
  const [query, setQuery]             = useState(initial)
  const [filter, setFilter]           = useState('all')
  const [sentiment, setSentiment]     = useState('all')
  const [source, setSource]           = useState('all')
  const [sortBy, setSortBy]           = useState('relevance')
  const inputRef = useRef(null)
  const [allEvents, setAllEvents]     = useState(USE_MOCK ? MOCK_EVENTS.events : [])
  const [allSources, setAllSources]   = useState(USE_MOCK ? MOCK_SOURCES.sources : [])

  useEffect(() => {
    if (!USE_MOCK) {
      Promise.all([getEvents({ limit: 200 }), getSources()])
        .then(([evtData, srcData]) => {
          setAllEvents(evtData.events)
          setAllSources(srcData.sources)
        })
        .catch(() => {
          setAllEvents(MOCK_EVENTS.events)
          setAllSources(MOCK_SOURCES.sources)
        })
    }
  }, [])

  useEffect(() => { setParams(query ? { q: query } : {}) }, [query])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const syntheticArticles = useMemo(() => buildSyntheticArticles(allEvents), [allEvents])
  const entityPool        = useMemo(() => buildEntityPool(allEvents), [allEvents])
  const entityEventIndex  = useMemo(() => buildEntityEventIndex(allEvents, entityPool), [allEvents, entityPool])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out = []

    if (filter === 'all' || filter === 'events') {
      allEvents.forEach(ev => {
        if (ev.title.toLowerCase().includes(q)) {
          out.push({
            id: ev.id, type: 'event', title: ev.title,
            snippet: ev.entities.length > 0
              ? `Clustered narrative across ${ev.sources.length} outlets · entities: ${ev.entities.join(', ')}`
              : `Clustered narrative across ${ev.sources.length} outlets.`,
            sources: `${ev.sources.length} outlets`, articleCount: ev.article_count,
            sentiment: ev.dominant_sentiment, date: ev.date, eventId: ev.id,
            score: scoreMatch(ev.title, q),
          })
        }
      })
    }
    if (filter === 'all' || filter === 'articles') {
      syntheticArticles.forEach(art => {
        if (art.headline.toLowerCase().includes(q)) {
          out.push({
            id: art.id, type: 'article', title: art.headline,
            snippet: `Synthesized from event ${art.eventId} · source: ${art.source}`,
            source: art.source, sentiment: art.sentiment, date: art.date, eventId: art.id,
            score: scoreMatch(art.headline, q),
          })
        }
      })
    }
    if (filter === 'all' || filter === 'entities') {
      entityPool.forEach(name => {
        if (name.toLowerCase().includes(q)) {
          out.push({
            id: `ent_${name}`, type: 'entity', title: name,
            snippet: `Mentioned in ${entityEventIndex[name].length} event cluster${entityEventIndex[name].length === 1 ? '' : 's'}`,
            eventCount: entityEventIndex[name].length, date: entityEventIndex[name][0]?.date,
            eventId: entityEventIndex[name][0]?.id, score: scoreMatch(name, q),
          })
        }
      })
    }
    let filtered = out
    if (sentiment !== 'all') filtered = filtered.filter(r => r.sentiment === sentiment)
    if (source !== 'all')    filtered = filtered.filter(r => (r.sources || '').includes(source) || r.source === source)
    if (sortBy === 'relevance') filtered.sort((a, b) => b.score - a.score)
    if (sortBy === 'recent')    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    return filtered
  }, [query, filter, sentiment, source, sortBy, allEvents, syntheticArticles, entityPool, entityEventIndex])

  const counts = useMemo(() => {
    if (!query.trim()) return null
    const q = query.trim().toLowerCase()
    return {
      events:   allEvents.filter(e => e.title.toLowerCase().includes(q)).length,
      articles: syntheticArticles.filter(a => a.headline.toLowerCase().includes(q)).length,
      entities: entityPool.filter(n => n.toLowerCase().includes(q)).length,
    }
  }, [query])

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata title="Search | Vantage" description="Search across events, articles, and entities from Nepali news publishers." />
      <BackButton fallback="/dashboard" />

      <PageHero
        variant="dark"
        eyebrow={<><SearchIcon size={11} /> Search</>}
        title="Search the Vantage corpus"
        description="Search across event clusters, individual articles, and the entity index. Use ⌘K to jump here from anywhere."
        actions={
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2 py-1.5 font-mono">
              <Command size={11} /> K
            </span>
            <span>to open</span>
          </div>
        }
      />

      {/* Big search input */}
      <div className="card-elevated overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <SearchIcon size={18} className="text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events, articles, entities…"
            className="h-10 flex-1 bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              aria-label="Clear"
            >
              <X size={14} />
            </button>
          ) : null}
          <kbd className="hidden items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] md:inline-flex">
            <Command size={10} />K
          </kbd>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map(f => {
              const Icon = f.icon
              const count = counts ? (f.id === 'all' ? counts.events + counts.articles + counts.entities : counts[f.id]) : null
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn('chip', filter === f.id && 'is-active')}
                >
                  <Icon size={12} /> {f.label}
                  {count !== null ? (
                    <span className={cn(
                      'rounded-md px-1 text-[10px] font-bold',
                      filter === f.id ? 'bg-white/25 text-white' : 'bg-[var(--surface-sunken)] text-[var(--text-muted)]',
                    )}>{count}</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select value={sentiment} onChange={e => setSentiment(e.target.value)} className="field-input h-9 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-xs font-semibold">
              <option value="all">All sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <select value={source} onChange={e => setSource(e.target.value)} className="field-input h-9 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-xs font-semibold">
              <option value="all">All sources</option>
              {allSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="field-input h-9 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-xs font-semibold">
              {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!query.trim() ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[var(--text-muted)]" />
              <h3 className="section-title">Recent searches</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {RECENT_SEARCHES.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="chip"
                >
                  <SearchIcon size={11} /> {s}
                </button>
              ))}
            </div>
          </div>
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[var(--text-muted)]" />
              <h3 className="section-title">Trending</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TRENDING.map(s => (
                <button key={s} onClick={() => setQuery(s)} className="chip">
                  <Hash size={11} className="text-[var(--text-muted)]" /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={`No results for "${query}"`}
          description="Try a shorter query, change the filter, or check your spelling."
          action={
            <Button variant="outline" onClick={() => { setQuery(''); setFilter('all'); setSentiment('all'); setSource('all') }}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              <strong className="text-[var(--text)]">{results.length}</strong> result{results.length === 1 ? '' : 's'} for{' '}
              <span className="font-mono text-[var(--text)]">"{query}"</span>
            </span>
            {counts ? (
              <span>{counts.events} events · {counts.articles} articles · {counts.entities} entities</span>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            {results.map((r, i) => (
              <ResultCard key={r.id} result={r} query={query} delay={i * 0.03} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ResultCard({ result, query, delay = 0 }) {
  const meta = TYPE_META[result.type]
  const Icon = meta.icon

  return (
    <article
      className="card-elevated p-4 anim-fade-up transition-shadow hover:shadow-md"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[10px] font-bold uppercase tracking-wider',
            result.type === 'event'   && 'border-[var(--brand-100)] bg-[var(--brand-50)] text-[var(--brand-700)]',
            result.type === 'article' && 'border-[#fed7aa] bg-[var(--orange-50)] text-[var(--orange-700)]',
            result.type === 'entity'  && 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]',
          )}
        >
          <Icon size={11} /> {meta.label}
        </span>
        {result.sentiment ? (
          <span className={sentimentPill(result.sentiment)} style={{ fontSize: '0.65rem' }}>{result.sentiment}</span>
        ) : null}
        {result.source ? (
          <span className={cn('source-tag', sourceClass(result.source))}>{result.source}</span>
        ) : null}
        {result.date ? (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
            <Clock size={11} /> {fmtRelative(result.date)}
          </span>
        ) : null}
      </div>

      <Link
        to={result.type === 'event' ? `/event/${result.eventId}` : '#'}
        className="mt-2 block text-base font-semibold leading-snug text-[var(--text)] hover:text-[var(--brand-600)]"
      >
        {highlight(result.title, query)}
      </Link>

      <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{result.snippet}</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-muted)]">
        <span>
          {result.type === 'event'   && <>From {result.sources} · {result.articleCount} articles</>}
          {result.type === 'article' && <>via {result.source}</>}
          {result.type === 'entity'  && <>Mentioned in {result.eventCount} event{result.eventCount === 1 ? '' : 's'}</>}
        </span>
        {result.type === 'event' ? (
          <Link
            to={`/event/${result.eventId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-600)] hover:underline"
          >
            View event <ArrowUpRight size={12} />
          </Link>
        ) : null}
      </div>
    </article>
  )
}

function scoreMatch(text, q) {
  const t = text.toLowerCase()
  const idx = t.indexOf(q)
  if (idx === -1) return 0
  return 100 - idx
}

function highlight(text, q) {
  if (!q || !text) return text
  const lower = text.toLowerCase()
  const idx = lower.indexOf(q.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-[var(--yellow-100)] px-0.5 text-[var(--text)]">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}
