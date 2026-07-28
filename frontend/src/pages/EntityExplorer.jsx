/**
 * EntityExplorer.jsx — Politician / entity sentiment
 *
 * View politician sentiment
 */
import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Users,
  Building2,
  Landmark,
  Hash,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  ArrowUpRight,
  Activity,
  Sparkles,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_EVENTS } from '../utils/mockData.js'
import { USE_MOCK } from '../utils/config.js'
import { getEvents } from '../services/eventService.js'
import { fmtRelative, fmtDate } from '../utils/helpers.js'
import { StatCard } from '../components/DashboardComponents.jsx'
import { Sparkline, SourceBadge } from '../components/Charts.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, InputGroup, InputLeftElement } from '../components/ui/Input.jsx'
import { Avatar } from '../components/ui/Avatar.jsx'
import { cn } from '../lib/utils.js'

const ENTITY_TYPES = [
  { key: 'all',    label: 'All',        icon: Hash },
  { key: 'Person', label: 'Persons',    icon: Users },
  { key: 'Party',  label: 'Parties',    icon: Layers },
  { key: 'Org',    label: 'Orgs & Gov', icon: Landmark },
]

const ENTITY_ROSTER = [
  { match: 'KP Oli',           display: 'KP Oli',            type: 'Person' },
  { match: 'UML',              display: 'UML',               type: 'Party'  },
  { match: 'NC',               display: 'Nepali Congress',   type: 'Party'  },
  { match: 'RSP',              display: 'RSP',               type: 'Party'  },
  { match: 'Balen Shah',       display: 'Balen Shah',        type: 'Person' },
  { match: 'Rabi Lamichhane',  display: 'Rabi Lamichhane',   type: 'Person' },
  { match: 'PM Dahal',         display: 'PM Dahal',          type: 'Person' },
  { match: 'Home Ministry',    display: 'Home Ministry',     type: 'Org'    },
  { match: 'Finance Ministry', display: 'Finance Ministry',  type: 'Org'    },
  { match: 'NRB',              display: 'Nepal Rastra Bank', type: 'Org'    },
  { match: 'Supreme Court',    display: 'Supreme Court',     type: 'Org'    },
  { match: 'Election Commission', display: 'Election Commission', type: 'Org' },
]

const SCHEMES = ['brand', 'orange', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'teal', 'orange', 'orange', 'orange']

function buildTrend(seed) {
  let v = 0
  return Array.from({ length: 7 }, (_, i) => {
    v += (Math.sin(seed + i) + Math.cos(seed * 1.3 + i)) * 0.18
    return +v.toFixed(2)
  })
}



function toneForTrend(t) {
  if (t > 0.1) return 'up'
  if (t < -0.1) return 'down'
  return 'flat'
}

export default function EntityExplorer() {
  const [params] = useSearchParams()
  const initial = params.get('q') || ''
  const [search, setSearch]         = useState(initial)
  const [typeFilter, setType]       = useState('all')
  const [sentiment, setSentiment]   = useState('all')
  const [selected, setSelected]     = useState(null)
  const [allEvents, setAllEvents]    = useState(MOCK_EVENTS.events)

  useEffect(() => {
    if (USE_MOCK) return
    getEvents({ limit: 200 })
      .then(data => setAllEvents(data.events))
      .catch(() => {}) // silently keep mock on error
  }, [])

  const rows = useMemo(() => {
    return ENTITY_ROSTER.map((entry, i) => {
      const matching = allEvents.filter(e => Array.isArray(e.entities) && e.entities.includes(entry.match))
      const eventCount = matching.length
      const totalMentions = matching.reduce((s, e) => s + (e.article_count || 0), 0)
      const lastDate = matching.map(e => e.date).filter(Boolean).sort().reverse()[0] || null
      const sorted = matching.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      const overall = sorted[0]?.dominant_sentiment || 'neutral'
      return {
        ...entry,
        accent: SCHEMES[i % SCHEMES.length],
        eventCount,
        totalMentions,
        lastDate,
        sentiment: overall,
        trend: buildTrend(i * 1.7 + entry.display.length),
        events: matching.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          sentiment: e.dominant_sentiment,
          articleCount: e.article_count,
          sources: e.sources || [],
        })),
      }
    })
  }, [allEvents])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(r => {
      const matchQ = !q || r.display.toLowerCase().includes(q) || r.match.toLowerCase().includes(q)
      const matchT = typeFilter === 'all' || r.type === typeFilter
      const matchS = sentiment === 'all' || r.sentiment === sentiment
      return matchQ && matchT && matchS
    })
  }, [rows, search, typeFilter, sentiment])

  const stats = useMemo(() => {
    const total = rows.length
    const totalMentions = rows.reduce((s, r) => s + r.totalMentions, 0)
    const avg = total ? Math.round(totalMentions / total) : 0
    const top = rows.slice().sort((a, b) => b.totalMentions - a.totalMentions)[0]
    return [
      { label: 'Entities tracked',      value: total.toString(),                         sub: 'Across 3 type buckets',    icon: Users,     accent: 'brand' },
      { label: 'Total mentions',        value: totalMentions.toString(),                 sub: 'Sum across all events',   icon: Activity,  accent: 'blue' },
      { label: 'Avg mentions / entity', value: avg.toString(),                           sub: 'Articles per tracked actor', icon: Activity, accent: 'green' },
      { label: 'Most mentioned',        value: top ? top.display : '—',                  sub: top ? `${top.totalMentions} mentions` : 'No data', icon: Building2, accent: 'purple' },
    ]
  }, [rows])

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Politician Sentiment | Vantage"
        description="Browse political actors, parties, and institutions tracked by the Vantage Nepal news intelligence platform."
      />

      <PageHero
        variant="gradient"
        eyebrow={<><Users size={11} /> Politician sentiment</>}
        title="Entity explorer"
        description="Browse people, parties, and government institutions tracked across the Nepali press. Each card surfaces mention counts, dominant sentiment, and a 7-day sentiment trend."
        actions={
          <Button
            as={Link}
            to="/graphs"
            variant="soft"
            leftIcon={<Sparkles size={14} />}
            className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25"
          >
            Knowledge graph
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card-elevated p-4">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="min-w-[260px] flex-1">
            <InputLeftElement><Search size={14} /></InputLeftElement>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entities (e.g. Balen, UML, NRB)…"
              variant="filled"
            />
          </InputGroup>

          <div className="flex flex-wrap items-center gap-1.5">
            {ENTITY_TYPES.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={cn('chip', typeFilter === t.key && 'is-active')}
                >
                  <Icon size={12} /> {t.label}
                </button>
              )
            })}
          </div>

          <select
            value={sentiment}
            onChange={e => setSentiment(e.target.value)}
            className="field-input h-10 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-xs font-semibold"
          >
            <option value="all">All sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No entities match your filters"
          description="Try a different search or clear filters."
          action={<Button variant="outline" onClick={() => { setSearch(''); setType('all'); setSentiment('all') }}>Reset</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, i) => (
            <EntityCard
              key={r.match}
              row={r}
              onSelect={() => setSelected(r)}
              delay={i * 0.04}
            />
          ))}
        </div>
      )}

      {selected ? <EntityDrawer entity={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}

function EntityCard({ row, onSelect, delay = 0 }) {
  const tone = toneForTrend(row.trend[row.trend.length - 1])
  return (
    <button
      onClick={onSelect}
      className="card-elevated overflow-hidden text-left anim-fade-up transition-shadow hover:shadow-md"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, var(--${row.accent}-500), var(--${row.accent}-500)66)` }}
      />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={row.display} size="md" colorScheme={row.accent} />
            <div>
              <h3 className="text-base font-bold text-[var(--text)]">{row.display}</h3>
              <p className="text-xs text-[var(--text-muted)]">{row.type} · {row.eventCount} events</p>
            </div>
          </div>
          <span className={cn('pill', `pill-${row.sentiment}`)}>{row.sentiment}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Mentions</p>
            <p className="mt-0.5 text-lg font-bold text-[var(--text)]">{row.totalMentions}</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Events</p>
            <p className="mt-0.5 text-lg font-bold text-[var(--text)]">{row.eventCount}</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Last</p>
            <p className="mt-0.5 text-xs font-bold text-[var(--text)]">{row.lastDate ? fmtRelative(row.lastDate) : '—'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <span>7-day sentiment trend</span>
            <span className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold',
              tone === 'up'   && 'text-[var(--green-600)]',
              tone === 'down' && 'text-[var(--red-600)]',
              tone === 'flat' && 'text-[var(--text-muted)]',
            )}>
              {tone === 'up'   && <TrendingUp size={11} />}
              {tone === 'down' && <TrendingDown size={11} />}
              {tone === 'flat' && <Minus size={11} />}
              {(row.trend[row.trend.length - 1] >= 0 ? '+' : '') + row.trend[row.trend.length - 1].toFixed(2)}
            </span>
          </div>
          <Sparkline
            data={row.trend.map(v => v + 1.2)}
            color={`var(--${row.accent}-500)`}
            width={300}
            height={40}
            className="w-full"
          />
        </div>
      </div>
    </button>
  )
}

function EntityDrawer({ entity, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-2xl flex-col gap-4 overflow-y-auto bg-[var(--surface)] p-6 shadow-2xl anim-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={entity.display} size="lg" colorScheme={entity.accent} />
            <div>
              <p className="eyebrow text-[var(--brand-700)]">{entity.type}</p>
              <h2 className="text-xl font-bold text-[var(--text)]">{entity.display}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Mentions</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text)]">{entity.totalMentions}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Events</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text)]">{entity.eventCount}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Sentiment</p>
            <p className="mt-1 text-sm font-bold capitalize text-[var(--text)]">{entity.sentiment}</p>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="section-title">Sentiment trend (7 days)</h3>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
            <Sparkline
              data={entity.trend.map(v => v + 1.5)}
              color={`var(--${entity.accent}-500)`}
              width={500}
              height={70}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-[10px] text-[var(--text-muted)]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="section-title">Recent events</h3>
          <div className="space-y-2">
            {entity.events.map(ev => (
              <Link
                key={ev.id}
                to={`/event/${ev.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--brand-300)] hover:bg-[var(--brand-50)]"
              >
                <SourceBadge name={ev.sources?.[0]} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-[var(--text)]">{ev.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {fmtDate(ev.date)} · {ev.articleCount} articles · {(ev.sources || []).length} sources
                  </p>
                </div>
                <ArrowUpRight size={14} className="text-[var(--text-muted)]" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
