import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, RefreshCw, AlertCircle, Layers, Newspaper, Activity, TrendingUp, ArrowRight, Sparkles, Plus, ArrowUpRight, Flame, Building2, Filter, CheckCircle2, Zap, Globe } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { getEvents } from '../services/eventService.js'
import { getSources } from '../services/sourceService.js'
import { fmtRelative } from '../utils/helpers.js'
import { useAuth } from '../providers/AuthProvider.jsx'
import { StatCard, NewsCard } from '../components/DashboardComponents.jsx'
import { SentimentDonut, ActivityFeed, SourceBadge, BarList } from '../components/Charts.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, InputGroup, InputLeftElement } from '../components/ui/Input.jsx'
import { Avatar } from '../components/ui/Avatar.jsx'
import { cn } from '../lib/utils.js'

const AI_INSIGHTS = [
  { id: 1, type: 'trend', text: 'Rising negative sentiment detected in "Political Stability" cluster across 3 outlets.', tone: 'negative', time: '4m ago' },
  { id: 2, type: 'anomaly', text: 'Unusual coverage spike for "Entity: Ministry of Finance" in the last 4 hours.', tone: 'warning', time: '27m ago' },
  { id: 3, type: 'pattern', text: 'Consistent framing of "Economic Reform" as "Risk" in 80% of tracked sources.', tone: 'brand', time: '1h ago' },
  { id: 4, type: 'alert', text: 'KP Oli mention volume up 38% week-over-week — bias tracking now active.', tone: 'positive', time: '2h ago' },
]

const RECENT_ACTIVITY = [
  { id: 1, title: 'New event cluster', detail: '#42 created: "Election Reforms"', time: '2m ago', icon: Zap, tone: 'primary' },
  { id: 2, title: 'Ingestion completed', detail: '12 articles added from The Kathmandu Post', time: '15m ago', icon: Newspaper, tone: 'positive' },
  { id: 3, title: 'Sentiment re-scored', detail: '"Entity: PM Office" across 4 sources', time: '1h ago', icon: Activity, tone: 'warning' },
  { id: 4, title: 'Source back online', detail: 'Setopati English resumed after 3h downtime', time: '2h ago', icon: CheckCircle2, tone: 'positive' },
  { id: 5, title: 'Cluster merged', detail: '"Cabinet Talks" + "Coalition Math" → #38', time: '3h ago', icon: Layers, tone: 'primary' },
]

const SENTIMENT_FILTERS = [{ key: 'all', label: 'All', icon: Layers }, { key: 'positive', label: 'Positive', icon: TrendingUp }, { key: 'neutral', label: 'Neutral', icon: Activity }, { key: 'negative', label: 'Negative', icon: AlertCircle }]
const SORTS = [{ key: 'date', label: 'Latest' }, { key: 'articles', label: 'Most covered' }, { key: 'match', label: 'Highest match' }]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [sources, setSources] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sentFilter, setSent] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sourceFilter, setSource] = useState('all')
  const load = async () => { setLoading(true); setError(null); try { const [evtData, srcData] = await Promise.all([getEvents(), getSources()]); setEvents(evtData.events); setTotal(evtData.total); setSources(srcData.sources) } catch (e) { setError(e.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const counts = useMemo(() => { const c = { positive: 0, negative: 0, neutral: 0 }; events.forEach(e => { if (e.dominant_sentiment in c) c[e.dominant_sentiment]++ }); return c }, [events])
  const totalArticles = useMemo(() => events.reduce((s, e) => s + (e.article_count || 0), 0), [events])
  const filtered = useMemo(() => { const q = search.toLowerCase(); let arr = events.filter(e => { const matchQ = !q || e.title.toLowerCase().includes(q) || e.entities?.some(x => x.toLowerCase().includes(q)); const matchS = sentFilter === 'all' || e.dominant_sentiment === sentFilter; const matchSrc = sourceFilter === 'all' || (e.sources || []).includes(sourceFilter); return matchQ && matchS && matchSrc }); arr.sort((a, b) => { if (sortBy === 'date') return new Date(b.date) - new Date(a.date); if (sortBy === 'articles') return (b.article_count || 0) - (a.article_count || 0); if (sortBy === 'match') return (b.similarity_score || 0) - (a.similarity_score || 0); return 0 }); return arr }, [events, search, sentFilter, sortBy, sourceFilter])
  const trendingEntities = useMemo(() => { const map = new Map(); events.forEach(e => (e.entities || []).forEach(en => map.set(en, (map.get(en) || 0) + (e.article_count || 0)))); return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count })) }, [events])
  const sourceActivity = useMemo(() => { const m = new Map(); events.forEach(e => (e.sources || []).forEach(s => m.set(s, (m.get(s) || 0) + (e.article_count || 0)))); return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count, color: 'var(--color-brand-500)' })) }, [events])
  const SENT_PILLS = [{ key: 'all', label: 'All', count: events.length, color: 'var(--color-brand-500)' }, { key: 'positive', label: 'Positive', count: counts.positive, color: 'var(--color-sentiment-positive)' }, { key: 'neutral', label: 'Neutral', count: counts.neutral, color: 'var(--color-sentiment-neutral)' }, { key: 'negative', label: 'Negative', count: counts.negative, color: 'var(--color-sentiment-negative)' }]

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata title="Vantage Dashboard | Nepal News Intelligence" description="Live news intelligence dashboard: clustered events, sentiment overview, AI insights and source coverage." />
      <PageHero variant="gradient" eyebrow={<><Sparkles size={11} /> News Intelligence</>} title={<>Welcome back, <span className="text-white/80">{user?.full_name || 'User'}</span></>} description={`${total} events tracked today across ${sources.length || 0} Nepali English outlets — the pipeline is active and clustering in real time.`} actions={<><Button variant="soft" leftIcon={<RefreshCw size={14} className={loading ? 'anim-spin' : ''} />} onClick={load} className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25">Refresh</Button><Button as={Link} to="/playground" leftIcon={<Sparkles size={14} />} className="bg-white text-[var(--color-brand-700)] hover:bg-white/90">AI Playground</Button></>} visual={<div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">Today</p><div className="mt-2 flex items-baseline gap-2"><span className="text-3xl font-bold text-white">{events.length || 6}</span><span className="text-xs font-medium text-white/70">events</span></div><p className="mt-1 text-xs text-white/80"><TrendingUp size={11} className="inline" /> +2 from yesterday</p></div><div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">Ingested</p><div className="mt-2 flex items-baseline gap-2"><span className="text-3xl font-bold text-white">{totalArticles || 84}</span><span className="text-xs font-medium text-white/70">articles</span></div><p className="mt-1 text-xs text-white/80">last 24 hours · 7 sources</p></div><div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">Pipeline</p><div className="mt-2 flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75 anim-pulse" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" /></span><span className="text-base font-semibold text-white">All systems normal</span></div><p className="mt-1 text-xs text-white/80">7/7 sources online · 320ms latency</p></div></div>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Events today" value={String(events.length || 6)} sub="↑ 2 from yesterday" icon={Layers} accent="brand" delta={{ label: '+33%', tone: 'up' }} />
        <StatCard label="Articles ingested" value={String(totalArticles || 84)} sub="Last 24 hours · 7 sources" icon={Newspaper} accent="blue" />
        <StatCard label="Avg cluster similarity" value="0.89" sub="Threshold: 0.85" icon={Activity} accent="green" />
        <StatCard label="Sources online" value={`${sources.length || 7}/${sources.length || 7}`} sub="All portals active" icon={Building2} accent="purple" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)]"><Sparkles size={14} /></span><h2 className="section-title">AI Insights</h2></div>
            <Link to="/insights" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-600)] hover:underline">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">{AI_INSIGHTS.map((ins, i) => { const toneMap = { negative: { dot: 'bg-[var(--color-danger)]', chip: 'red' }, warning: { dot: 'bg-[var(--color-warning)]', chip: 'yellow' }, positive: { dot: 'bg-[var(--color-success)]', chip: 'green' }, brand: { dot: 'bg-[var(--color-brand-500)]', chip: 'brand' } }; const t = toneMap[ins.tone] || toneMap.brand; return (<article key={ins.id} className="card-elevated p-4 anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}><div className="flex items-center gap-2"><span className={cn('h-2 w-2 rounded-full', t.dot)} /><Badge colorScheme={t.chip} size="sm">{ins.type}</Badge><span className="ml-auto text-[10px] text-[var(--color-text-muted)]">{ins.time}</span></div><p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">{ins.text}</p></article>)})}</div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-success-bg)] text-[var(--color-success)]"><Activity size={14} /></span><h2 className="section-title">Recent activity</h2></div>
          <div className="card-elevated p-5"><ActivityFeed items={RECENT_ACTIVITY} /></div>
        </div>
      </div>
      <section className="flex flex-col gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow text-[var(--color-brand-700)]">News feed</p><h2 className="mt-1 h-lg">Trending event clusters</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">Live clustered coverage of Nepali English publishers — refreshed every five minutes.</p></div>
          <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand-600)] hover:underline">Open full archive <ArrowUpRight size={14} /></Link>
        </header>
        <div className="card-elevated p-3">
          <div className="flex flex-wrap items-center gap-2">
            <InputGroup className="min-w-[200px] flex-1"><InputLeftElement><Search size={14} /></InputLeftElement><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, entities, or keywords…" variant="filled" /></InputGroup>
            <div className="flex flex-wrap items-center gap-1.5">{SENT_PILLS.map(p => <button key={p.key} onClick={() => setSent(p.key)} className={cn('chip', sentFilter === p.key && 'is-active')}><span className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.label}<span className={cn('rounded-md px-1 text-[10px] font-bold', sentFilter === p.key ? 'bg-white/25 text-white' : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)]')}>{p.count}</span></button>)}</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="field-input h-10 w-auto rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] px-3 text-xs font-semibold">{SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
          </div>
        </div>
        {error ? <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] px-4 py-3 text-sm text-[var(--color-danger)]"><AlertCircle size={16} /> {error}</div> : null}
        {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-56" />)}</div> : filtered.length === 0 ? <EmptyState icon={Search} title="No events match your filters" description="Try clearing the search box or selecting a different sentiment." action={<Button variant="outline" onClick={() => { setSearch(''); setSent('all'); setSource('all') }}>Clear filters</Button>} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((ev, i) => <NewsCard key={ev.id} event={ev} delay={i * 0.04} />)}</div>}
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)]"><Flame size={14} /></span><h2 className="section-title">Trending entities</h2></div>
            <Link to="/entities" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-600)] hover:underline">Open explorer <ArrowUpRight size={12} /></Link>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Most-mentioned people, parties, and institutions in the last 24 hours.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{trendingEntities.map((e, i) => { const max = trendingEntities[0]?.count || 1; return (<button key={e.name} onClick={() => navigate(`/entities?q=${encodeURIComponent(e.name)}`)} className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-left transition-all hover:border-[var(--color-brand-200)] hover:shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-xs font-bold text-[var(--color-brand-700)]">#{i + 1}</span><div className="flex-1"><p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-brand-600)]">{e.name}</p><p className="text-[11px] text-[var(--color-text-muted)]">{e.count} mentions · trending</p></div><div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-surface-sunken)]"><div className="h-full rounded-full bg-[var(--color-brand-500)]" style={{ width: `${(e.count / max) * 100}%` }} /></div></button>)})}</div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"><Building2 size={14} /></span><h2 className="section-title">Source activity</h2></div>
            <Link to="/publishers" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-600)] hover:underline">All <ArrowUpRight size={12} /></Link>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Articles contributed in the last 24h.</p>
          <div className="mt-5"><BarList items={sourceActivity.map(s => ({ ...s, color: 'var(--color-brand-500)' }))} /></div>
        </div>
      </div>
    </div>
  )
}