/**
 * MediaHouses.jsx — Media house report
 *
 * View media house report
 */
import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Activity,
  ArrowRight,
  Search,
  BarChart3,
  ExternalLink,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_BIAS } from '../utils/mockData.js'
import { getBiasReport } from '../services/biasService.js'
import { StatCard } from '../components/DashboardComponents.jsx'
import { Sparkline, SourceBadge } from '../components/Charts.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, InputGroup, InputLeftElement } from '../components/ui/Input.jsx'
import { cn } from '../lib/utils.js'

const SOURCE_COLORS = {
  'The Kathmandu Post':   '#dc2626',
  'Republica':            '#f97316',
  'OnlineKhabar English': '#f59e0b',
  'The Himalayan Times':  '#16a34a',
}

function ScoreBadge({ score, dark = false }) {
  if (score > 0.1) return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
      dark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    )}>
      <TrendingUp size={11} /> +{score.toFixed(2)}
    </span>
  )
  if (score < -0.1) return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
      dark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700',
    )}>
      <TrendingDown size={11} /> {score.toFixed(2)}
    </span>
  )
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
      dark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700',
    )}>
      <Minus size={11} /> {score.toFixed(2)}
    </span>
  )
}

function PublisherCard({ house, index }) {
  const color = SOURCE_COLORS[house.name] || '#f97316'
  const total = house.positive + house.negative + house.neutral
  const latest = house.trend?.[house.trend.length - 1]?.score ?? 0
  const negPct = total ? Math.round(house.negative / total * 100) : 0
  const posPct = total ? Math.round(house.positive / total * 100) : 0
  const dir = latest > 0.1 ? 'Critical of Govt' : latest < -0.1 ? 'Critical of Opposition' : 'Balanced'

  return (
    <article
      className="card-elevated relative overflow-hidden anim-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }} />

      <div className="space-y-5 p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <SourceBadge name={house.name} size="md" />
            <div>
              <h3 className="text-base font-bold text-[var(--text)]">{house.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">{total} articles tracked · {negPct}% negative</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Latest score</p>
            <div className="mt-1"><ScoreBadge score={latest} /></div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Positive</p>
            <p className="mt-1 text-2xl font-bold text-[var(--green-600)]">{house.positive}</p>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">{posPct}%</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Neutral</p>
            <p className="mt-1 text-2xl font-bold text-[var(--yellow-600)]">{house.neutral}</p>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">{total ? Math.round(house.neutral / total * 100) : 0}%</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Negative</p>
            <p className="mt-1 text-2xl font-bold text-[var(--red-600)]">{house.negative}</p>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">{negPct}%</p>
          </div>
        </div>

        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--surface-sunken)]">
          <div className="h-full bg-emerald-500" style={{ width: `${posPct}%` }} />
          <div className="h-full bg-amber-500"   style={{ width: `${total ? Math.round(house.neutral / total * 100) : 0}%` }} />
          <div className="h-full bg-rose-500"    style={{ width: `${negPct}%` }} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="eyebrow">7-day bias trend</p>
            <span className="text-[10px] text-[var(--text-muted)]">
              {house.trend?.[0]?.date} → {house.trend?.[house.trend.length - 1]?.date}
            </span>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-2">
            <Sparkline
              data={house.trend.map(t => t.score + 1)}
              color={color}
              width={300}
              height={50}
              className="w-full"
            />
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Bias direction</p>
            <p className="mt-0.5 font-semibold" style={{
              color: latest > 0.1 ? '#059669' : latest < -0.1 ? '#dc2626' : '#b45309',
            }}>
              {dir}
            </p>
          </div>
          <Link
            to={`/publisher/${house.name.toLowerCase().replace(/ /g, '-')}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-600)] hover:underline"
          >
            Open profile <ArrowRight size={12} />
          </Link>
        </footer>
      </div>
    </article>
  )
}

function buildStats(mediaHouses) {
  const total = mediaHouses.length
  const totalArticles = mediaHouses.reduce((s, m) => s + m.positive + m.negative + m.neutral, 0)
  const latestScores = mediaHouses.map(m => m.trend?.[m.trend.length - 1]?.score ?? 0)
  const avgScore = latestScores.length ? latestScores.reduce((a, b) => a + b, 0) / latestScores.length : 0
  const mostActive = mediaHouses.slice().sort(
    (a, b) => (b.positive + b.negative + b.neutral) - (a.positive + a.negative + a.neutral)
  )[0]
  return [
    { label: 'Total publishers',     value: total.toString(),         sub: 'Tracked across the platform',         icon: Building2,  accent: 'brand' },
    { label: 'Articles this week',   value: totalArticles.toString(), sub: 'Sum of positive, neutral, negative',  icon: Newspaper,  accent: 'blue' },
    { label: 'Avg sentiment score',  value: (avgScore >= 0 ? '+' : '') + avgScore.toFixed(2), sub: 'Mean latest daily score', icon: Activity, accent: 'green' },
    { label: 'Most active',         value: mostActive ? mostActive.name.replace('The ','') : '—', sub: mostActive ? `${mostActive.positive + mostActive.negative + mostActive.neutral} articles` : 'No data', icon: BarChart3, accent: 'purple' },
  ]
}

export default function MediaHouses() {
  const [search, setSearch]     = useState('')
  const [sortBy, setSortBy]     = useState('articles')
  const [biasData, setBiasData] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        setBiasData(USE_MOCK ? MOCK_BIAS : await getBiasReport())
      } catch (e) {
        setBiasData(MOCK_BIAS)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const houses = useMemo(() => biasData?.media_houses || [], [biasData])
  const stats  = useMemo(() => buildStats(houses), [houses])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let arr = houses.filter(h => !q || h.name.toLowerCase().includes(q))
    if (sortBy === 'articles')  arr.sort((a, b) => (b.positive + b.negative + b.neutral) - (a.positive + a.negative + a.neutral))
    if (sortBy === 'negative')  arr.sort((a, b) => b.negative - a.negative)
    if (sortBy === 'positive')  arr.sort((a, b) => b.positive - a.positive)
    if (sortBy === 'name')      arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [houses, search, sortBy])

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Media Houses | Vantage"
        description="Per-publisher sentiment reports for Nepali English news outlets."
      />

      <PageHero
        variant="gradient"
        eyebrow={<><Newspaper size={11} /> Media houses</>}
        title="Media house report cards"
        description="Per-publisher sentiment distribution, 7-day bias trends, and editorial direction. Click any card to open the full profile."
        actions={
          <Button
            as={Link}
            to="/bias"
            variant="soft"
            leftIcon={<BarChart3 size={14} />}
            className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25"
          >
            Bias dashboard
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
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search publishers…" variant="filled" />
          </InputGroup>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="field-input h-10 w-auto rounded-[var(--radius-lg)] bg-[var(--surface-muted)] px-3 text-sm font-semibold">
            <option value="articles">Most articles</option>
            <option value="negative">Most negative</option>
            <option value="positive">Most positive</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((h, i) => <PublisherCard key={h.name} house={h} index={i} />)}
      </div>
    </div>
  )
}
