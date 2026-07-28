/**
 * KnowledgeGraph.jsx — Entity & relationship map
 */
import { Network, Users, Building2, Landmark, Layers } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { StatCard } from '../components/DashboardComponents.jsx'
import { Badge } from '../components/ui/Badge.jsx'

const NODES = [
  { id: 'kp-oli',     name: 'KP Oli',         type: 'Person', x: 30, y: 30, color: '#f97316' },
  { id: 'uml',         name: 'UML',            type: 'Party',  x: 50, y: 15, color: '#ea580c' },
  { id: 'rsp',         name: 'RSP',            type: 'Party',  x: 75, y: 30, color: '#fb923c' },
  { id: 'nc',          name: 'Nepali Congress', type: 'Party',  x: 25, y: 65, color: '#fdba74' },
  { id: 'pm-dahal',    name: 'PM Dahal',       type: 'Person', x: 50, y: 50, color: '#c2410c' },
  { id: 'balen',       name: 'Balen Shah',     type: 'Person', x: 80, y: 65, color: '#16a34a' },
  { id: 'supreme',     name: 'Supreme Court',  type: 'Org',    x: 50, y: 85, color: '#f59e0b' },
  { id: 'nrb',         name: 'NRB',            type: 'Org',    x: 15, y: 45, color: '#dc2626' },
]

const EDGES = [
  { from: 'kp-oli',  to: 'uml' },
  { from: 'rsp',     to: 'pm-dahal' },
  { from: 'nc',      to: 'pm-dahal' },
  { from: 'balen',   to: 'rsp' },
  { from: 'pm-dahal', to: 'supreme' },
  { from: 'kp-oli',  to: 'nrb' },
  { from: 'nc',      to: 'supreme' },
  { from: 'uml',     to: 'pm-dahal' },
]

export default function KnowledgeGraph() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Knowledge Graph | Vantage"
        description="Entity and relationship map across Nepali politics and media coverage."
      />

      <BackButton fallback="/dashboard" />

      <PageHero
        variant="light"
        eyebrow={<><Network size={11} /> Knowledge Graph</>}
        title="Entity relationship map"
        description="Visualize how political actors, parties, and institutions connect across the Nepali news landscape."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Entities"      value="160+"  sub="Across 3 type buckets"    icon={Users}     accent="brand" />
        <StatCard label="Relationships"  value="4.2k"  sub="Tracked across all events" icon={Network}   accent="blue" />
        <StatCard label="Parties"        value="14"    sub="Political organisations"   icon={Layers}    accent="purple" />
        <StatCard label="Government"     value="9"     sub="Ministries & institutions" icon={Landmark}  accent="green" />
      </div>

      <Card>
        <CardHeader>
          <div>
            <p className="eyebrow text-[var(--brand-700)]">Graph view</p>
            <h2 className="text-sm font-bold text-[var(--text)]">Entity relationship network</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--surface-muted)] to-[var(--brand-50)]/30">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {EDGES.map((e, i) => {
                const a = NODES.find(n => n.id === e.from)
                const b = NODES.find(n => n.id === e.to)
                return (
                  <line
                    key={i}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="var(--brand-300)" strokeWidth="0.3" strokeDasharray="0.5 0.5"
                  />
                )
              })}
            </svg>
            {NODES.map(n => (
              <div
                key={n.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110"
                  style={{ background: n.color }}
                >
                  <span className="text-xs font-bold">{n.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
                </div>
                <p className="mt-1 text-center text-[10px] font-bold text-[var(--text)]">{n.name}</p>
                <p className="text-center text-[9px] text-[var(--text-muted)]">{n.type}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <p className="eyebrow text-[var(--brand-700)]">All entities</p>
            <h2 className="text-sm font-bold text-[var(--text)]">Tracked people, parties, organisations</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {NODES.map(n => (
              <div key={n.id} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: n.color }}
                >
                  {n.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{n.name}</p>
                  <Badge colorScheme="gray" size="sm">{n.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
