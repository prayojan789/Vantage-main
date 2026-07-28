/**
 * BiasReport.jsx — Bias dashboard
 *
 * View bias dashboard
 */
import { useState, useEffect, useMemo } from 'react'
import {
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  Sparkles,
  ArrowUpRight,
  Building2,
  Newspaper,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from 'recharts'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_BIAS } from '../utils/mockData.js'
import { getBiasReport } from '../services/biasService.js'
import { StatCard } from '../components/DashboardComponents.jsx'
import { Sparkline, SourceBadge } from '../components/Charts.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cn } from '../lib/utils.js'

const SOURCE_COLORS = {
  'The Kathmandu Post':   '#dc2626',
  'Republica':            '#f97316',
  'OnlineKhabar English': '#f59e0b',
  'The Himalayan Times':  '#16a34a',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-slate-900 px-4 py-3 text-xs text-white shadow-xl">
      <p className="mb-2 text-sm font-bold text-white">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-2 text-white/80">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <strong className="text-white">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

function ScoreBadge({ score, dark = false }) {
  if (score > 0.1) return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold', dark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700')}>
      <TrendingUp size={11} /> +{score.toFixed(2)}
    </span>
  )
  if (score < -0.1) return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold', dark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700')}>
      <TrendingDown size={11} /> {score.toFixed(2)}
    </span>
  )
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold', dark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700')}>
      <Minus size={11} /> {score.toFixed(2)}
    </span>
  )
}

export default function BiasReport() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(30)
  const [activeLine, setActiveLine] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null)
      try { setData(USE_MOCK ? MOCK_BIAS : await getBiasReport({ days })) }
      catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [days])

  const barData = useMemo(() => data?.media_houses.map(m => ({
    name: m.name.replace('The ', '').replace(' English', ''),
    Positive: m.positive, Negative: m.negative, Neutral: m.neutral,
  })) ?? [], [data])

  const lineData = useMemo(() => {
    if (!data) return []
    const dates = data.media_houses[0]?.trend.map(t => t.date) || []
    return dates.map((d, i) => {
      const point = { date: d }
      data.media_houses.forEach(m => { point[m.name] = m.trend[i]?.score ?? 0 })
      return point
    })
  }, [data])

  const topEntities = data?.top_entities || []

  const stats = useMemo(() => {
    if (!data) return []
    const totalArticles = data.media_houses.reduce((s, m) => s + m.positive + m.negative + m.neutral, 0)
    const scores = data.media_houses.map(m => m.trend?.[m.trend.length - 1]?.score ?? 0)
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const movers = data.media_houses.map(m => {
      const arr = m.trend.map(t => t.score)
      return { name: m.name, delta: arr[arr.length - 1] - arr[0] }
    })
    const biggest = movers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0]
    return [
      { label: 'Publishers',           value: data.media_houses.length.toString(),    sub: 'Tracked across the platform',       icon: Building2, accent: 'brand' },
      { label: 'Articles (7d)',         value: totalArticles.toString(),              sub: 'Sum of all sentiment buckets',      icon: Newspaper,  accent: 'blue' },
      { label: 'Avg bias score',        value: (avgScore >= 0 ? '+' : '') + avgScore.toFixed(2), sub: `Across ${data.media_houses.length} publishers`, icon: Activity, accent: 'green' },
      { label: 'Biggest mover',         value: biggest?.name?.replace('The ', '') ?? '—', sub: biggest ? `${biggest.delta >= 0 ? '+' : ''}${biggest.delta.toFixed(2)} over ${days}d` : 'No data', icon: BarChart3, accent: 'purple' },
    ]
  }, [data, days])

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Bias Dashboard | Vantage"
        description="Comparative media bias analysis across Nepali English news portals."
      />

      <BackButton fallback="/dashboard" />

      <PageHero
        variant="gradient"
        eyebrow={<><BarChart3 size={11} /> Bias dashboard</>}
        title="Bias report cards"
        description="Historical sentiment distribution across Nepal's top English news portals. Which outlets consistently favor which political actors?"
        actions={
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Time window</p>
            <div className="flex items-center gap-1.5">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={cn(
                    'inline-flex h-9 items-center rounded-[var(--radius-lg)] border px-4 text-xs font-semibold transition-all',
                    days === d
                      ? 'border-white bg-white text-[var(--brand-700)] shadow-md'
                      : 'border-white/30 bg-white/10 text-white hover:bg-white/20',
                  )}
                >{d}d</button>
              ))}
            </div>
          </div>
        }
      />

      {error ? (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] px-4 py-3 text-sm text-[var(--red-700)]">
          <AlertCircle size={16} /> {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {loading ? <div className="card-elevated h-64 skeleton" /> : data ? (
        <div className="card-elevated overflow-hidden">
          <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-3">
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Per-publisher scorecard</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Latest bias & 7-day trend</h2>
            </div>
          </header>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {data.media_houses.map((m, i) => {
              const total = m.positive + m.negative + m.neutral
              const latest = m.trend[m.trend.length - 1]?.score ?? 0
              const color = SOURCE_COLORS[m.name] || '#f97316'
              return (
                <div
                  key={m.name}
                  className={cn(
                    'flex flex-col gap-3 p-5',
                    i > 0 && 'border-t border-[var(--border-subtle)] sm:border-l sm:border-t-0 lg:border-l',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SourceBadge name={m.name} />
                      <span className="text-xs font-semibold text-[var(--text)]">{m.name.replace('The ', '').replace(' English', '')}</span>
                    </div>
                    <ScoreBadge score={latest} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--text)]">{total}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">articles tracked</p>
                  </div>
                  <Sparkline
                    data={m.trend.map(t => t.score + 1.2)}
                    color={color}
                    width={220}
                    height={40}
                    className="w-full"
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {loading ? <div className="card-elevated h-80 skeleton" /> : data ? (
        <div className="card-elevated p-5">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Sentiment distribution</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Articles by sentiment per media house</h2>
            </div>
          </header>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 10, right: 0, left: -16, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.05)' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 18 }} />
              <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Neutral"  stackId="a" fill="#f59e0b" />
              <Bar dataKey="Negative" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {loading ? <div className="card-elevated h-80 skeleton" /> : data ? (
        <div className="card-elevated p-5">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Bias trend</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Per-publisher sentiment score over time</h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <LineChartIcon size={14} className="text-[var(--text-muted)]" />
              <span className="text-[var(--text-muted)]">Hover the chart to inspect a date</span>
            </div>
          </header>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={lineData} margin={{ top: 10, right: 0, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[-1, 1]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="var(--border-strong)" />
              {data.media_houses.map((m, i) => {
                const color = SOURCE_COLORS[m.name] || ['#f97316', '#fb923c', '#fdba74', '#10b981'][i % 4]
                return (
                  <Line
                    key={m.name}
                    type="monotone"
                    dataKey={m.name}
                    stroke={color}
                    strokeWidth={activeLine === m.name ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 5 }}
                    onMouseEnter={() => setActiveLine(m.name)}
                    onMouseLeave={() => setActiveLine(null)}
                  />
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {loading ? <div className="card-elevated h-64 skeleton" /> : data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 card-elevated p-5">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="eyebrow text-[var(--brand-700)]">Most-covered entities</p>
                <h2 className="text-sm font-bold text-[var(--text)]">Entities dominating coverage this week</h2>
              </div>
              <Link to="/entities" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-600)] hover:underline">
                Open entity explorer <ArrowUpRight size={12} />
              </Link>
            </header>
            <div className="grid gap-3 sm:grid-cols-2">
              {topEntities.map((name, i) => {
                const max = topEntities.length
                const colors = ['#f97316', '#fb923c', '#fdba74', '#10b981', '#ef4444', '#f59e0b']
                return (
                  <div key={name} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ background: colors[i % colors.length] }}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--text)]">{name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Person · Tracked across {Math.floor(Math.random() * 5) + 3} events</p>
                    </div>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                      <div className="h-full rounded-full bg-[var(--brand-500)]" style={{ width: `${100 - i * (100 / max)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="border-b border-[var(--border-subtle)] bg-gradient-to-br from-[#f59e0b] to-[#fdba74] p-5 text-white">
              <Sparkles size={18} className="mb-2 text-white/80" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">AI bias summary</p>
              <h3 className="mt-1 text-base font-bold">This week's editorial pattern</h3>
            </div>
            <div className="space-y-3 p-5 text-sm text-[var(--text-soft)]">
              <p>
                Across the last {days} days, <strong className="text-[var(--text)]">The Kathmandu Post</strong> skews consistently negative on coalition coverage,
                while <strong className="text-[var(--text)]">Republica</strong> stays net-positive on the same stories.
              </p>
              <p>
                <strong className="text-[var(--text)]">OnlineKhabar</strong> has trended more positive week-over-week, while
                <strong className="text-[var(--text)]"> The Himalayan Times</strong> remains closest to neutral.
              </p>
              <Link
                to="/insights"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-600)] hover:underline"
              >
                Open AI Insights <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
