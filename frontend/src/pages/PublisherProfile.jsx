/**
 * PublisherProfile.jsx — Single publisher profile
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building2, ExternalLink, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_BIAS } from '../utils/mockData.js'
import { getBiasReport } from '../services/biasService.js'
import { StatCard } from '../components/DashboardComponents.jsx'
import { Sparkline, SourceBadge } from '../components/Charts.jsx'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cn } from '../lib/utils.js'

const SOURCE_COLORS = {
  'The Kathmandu Post':   '#dc2626',
  'Republica':            '#f97316',
  'OnlineKhabar English': '#f59e0b',
  'The Himalayan Times':  '#16a34a',
}

export default function PublisherProfile() {
  const { id } = useParams()
  const [house, setHouse] = useState(null)

  useEffect(() => {
    const load = async () => {
      let mediaHouses = MOCK_BIAS.media_houses
      if (!USE_MOCK) {
        try {
          const data = await getBiasReport()
          mediaHouses = data.media_houses
        } catch (_) {}
      }
      const found = mediaHouses.find(h =>
        h.name.toLowerCase().replace(/ /g, '-') === id
      )
      setHouse(found || mediaHouses[0])
    }
    load()
  }, [id])

  if (!house) return null
  const color = SOURCE_COLORS[house.name] || '#f97316'
  const total = house.positive + house.negative + house.neutral
  const latest = house.trend?.[house.trend.length - 1]?.score ?? 0
  const negPct = total ? Math.round(house.negative / total * 100) : 0
  const posPct = total ? Math.round(house.positive / total * 100) : 0
  const dir = latest > 0.1 ? 'Critical of Govt' : latest < -0.1 ? 'Critical of Opposition' : 'Balanced'

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title={`${house.name} | Vantage`}
        description={`Bias report and sentiment analysis for ${house.name}.`}
      />

      <BackButton to="/publishers" label="Back to media houses" />

      <PageHero
        variant="light"
        eyebrow={<><Building2 size={11} /> Publisher profile</>}
        title={house.name}
        description={`${total} articles tracked across the last ${house.trend?.length || 7} days · ${negPct}% negative framing`}
        actions={
          <Button leftIcon={<ExternalLink size={14} />} variant="outline">Visit website</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Articles tracked"   value={String(total)}   sub={`${posPct}% positive · ${negPct}% negative`} icon={BarChart3}   accent="brand" />
        <StatCard label="Latest bias"         value={(latest >= 0 ? '+' : '') + latest.toFixed(2)} sub="Daily score"    icon={TrendingUp}  accent={latest > 0 ? 'green' : latest < 0 ? 'red' : 'yellow'} />
        <StatCard label="Coverage balance"   value="0.62"                sub="vs. industry 0.51" icon={BarChart3}  accent="blue" />
        <StatCard label="Bias direction"     value={dir}                  sub="Last 7 days"     icon={TrendingDown} accent="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <p className="eyebrow text-[var(--brand-700)]">7-day bias trend</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Daily bias score</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
              <Sparkline
                data={house.trend.map(t => t.score + 1.5)}
                color={color}
                width={600}
                height={120}
                className="w-full"
              />
              <div className="mt-3 flex justify-between text-[10px] text-[var(--text-muted)]">
                {house.trend.map(t => <span key={t.date}>{t.date}</span>)}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Sentiment mix</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Article distribution</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { label: 'Positive', value: house.positive, color: '#10b981' },
                { label: 'Neutral',  value: house.neutral,  color: '#f59e0b' },
                { label: 'Negative', value: house.negative, color: '#ef4444' },
              ].map(s => {
                const pct = total ? Math.round(s.value / total * 100) : 0
                return (
                  <div key={s.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text)]">{s.label}</span>
                      <span className="font-semibold text-[var(--text-muted)] tabular-nums">{s.value} · {pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
