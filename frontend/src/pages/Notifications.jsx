/**
 * Notifications.jsx — Notifications centre
 */
import { useState } from 'react'
import {
  Bell, CheckCircle2, AlertTriangle, Sparkles, Layers, Newspaper,
  TrendingUp, Building2, Settings as SettingsIcon, Check, BellRing,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { cn } from '../lib/utils.js'

const GROUPS = [
  {
    label: 'Today',
    items: [
      { id: 1, type: 'event', tone: 'brand',    icon: Layers,        title: 'New event cluster',       detail: 'Cluster #42 created: "Election Reforms"',                time: '2m ago',  unread: true,  route: '/events' },
      { id: 2, type: 'alert', tone: 'warning',  icon: AlertTriangle, title: 'Sentiment spike',          detail: '"Ministry of Finance" coverage up 4× in the last 4 hours', time: '12m ago', unread: true,  route: '/entities' },
      { id: 3, type: 'ingest',tone: 'positive', icon: Newspaper,     title: 'Ingestion completed',      detail: '12 articles added from The Kathmandu Post',              time: '15m ago', unread: false, route: '/articles' },
      { id: 4, type: 'ai',    tone: 'brand',    icon: Sparkles,      title: 'AI insight ready',         detail: 'New narrative divergence detected in "Cabinet Talks"',     time: '1h ago',  unread: false, route: '/insights' },
    ],
  },
  {
    label: 'This week',
    items: [
      { id: 5, type: 'event', tone: 'brand',    icon: Layers,        title: 'Cluster merged',           detail: '"Cabinet Talks" + "Coalition Math" merged into #38',         time: '1d ago',  unread: false, route: '/events' },
      { id: 6, type: 'source',tone: 'positive', icon: Building2,     title: 'Source back online',       detail: 'Setopati English resumed publishing after 3h downtime',     time: '2d ago',  unread: false, route: '/publishers' },
      { id: 7, type: 'system',tone: 'gray',     icon: SettingsIcon,  title: 'Weekly report ready',      detail: 'Q2 media bias audit has been generated',                   time: '3d ago',  unread: false, route: '/bias' },
    ],
  },
]

const TONE_MAP = {
  brand:    { bg: 'bg-[var(--brand-50)]',  fg: 'text-[var(--brand-600)]'  },
  positive: { bg: 'bg-[var(--green-50)]',  fg: 'text-[var(--green-600)]'  },
  warning:  { bg: 'bg-[var(--yellow-50)]', fg: 'text-[var(--yellow-600)]' },
  gray:     { bg: 'bg-[var(--surface-muted)]', fg: 'text-[var(--text-muted)]' },
}

const FILTERS = [
  { id: 'all',     label: 'All',     icon: Bell },
  { id: 'unread',  label: 'Unread',  icon: Sparkles },
  { id: 'events',  label: 'Events',  icon: Layers },
  { id: 'alerts',  label: 'Alerts',  icon: AlertTriangle },
]

export default function Notifications() {
  const [filter, setFilter] = useState('all')
  const [read, setRead] = useState(new Set([3, 4, 5, 6, 7]))

  const filtered = GROUPS.map(g => ({
    ...g,
    items: g.items.filter(n => {
      if (filter === 'all')    return true
      if (filter === 'unread') return !read.has(n.id) && n.unread
      if (filter === 'events') return n.type === 'event'
      if (filter === 'alerts') return n.type === 'alert'
      return true
    }),
  })).filter(g => g.items.length > 0)

  const total = GROUPS.reduce((s, g) => s + g.items.length, 0)
  const unread = GROUPS.reduce((s, g) => s + g.items.filter(n => n.unread && !read.has(n.id)).length, 0)

  const markAll = () => {
    setRead(new Set([...read, ...GROUPS.flatMap(g => g.items.map(n => n.id))]))
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Notifications | Vantage"
        description="Stay on top of new events, sentiment spikes, source issues and weekly reports."
      />

      <BackButton fallback="/dashboard" />

      <PageHero
        variant="gradient"
        eyebrow={<><Bell size={11} /> Notifications</>}
        title="What's happening on Vantage"
        description="Live updates on new event clusters, sentiment spikes, source availability and weekly bias reports."
        actions={
          <Button
            variant="soft"
            leftIcon={<Check size={14} />}
            onClick={markAll}
            className="bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25"
          >
            Mark all as read
          </Button>
        }
        visual={
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Unread</p>
              <p className="mt-1 text-2xl font-bold text-white">{unread}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Today</p>
              <p className="mt-1 text-2xl font-bold text-white">{GROUPS[0].items.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Total</p>
              <p className="mt-1 text-2xl font-bold text-white">{total}</p>
            </div>
          </div>
        }
      />

      <div className="card-elevated p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map(f => {
            const Icon = f.icon
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn('chip', filter === f.id && 'is-active')}
              >
                <Icon size={12} /> {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map(group => (
          <section key={group.label} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">{group.label}</h2>
              <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">
                {group.items.length}
              </span>
            </div>
            <div className="card-elevated divide-y divide-[var(--border-subtle)]">
              {group.items.map(n => {
                const Icon = n.icon
                const t = TONE_MAP[n.tone] || TONE_MAP.brand
                const isUnread = n.unread && !read.has(n.id)
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 p-4 transition-colors',
                      isUnread && 'bg-[var(--brand-50)]/30',
                    )}
                  >
                    <span className={cn('inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)]', t.bg, t.fg)}>
                      <Icon size={16} />
                    </span>
                    <Link to={n.route} className="min-w-0 flex-1 hover:underline">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={cn('text-sm font-semibold', isUnread ? 'text-[var(--text)]' : 'text-[var(--text-soft)]')}>
                          {n.title}
                        </p>
                        {isUnread ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-500)]" /> : null}
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{n.detail}</p>
                    </Link>
                    <span className="text-[11px] text-[var(--text-muted)]">{n.time}</span>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {filtered.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <Bell size={32} className="mx-auto text-[var(--text-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--text)]">No notifications here</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Try a different filter or check back later.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
