/**
 * AIInsights.jsx — Explainable narrative insights
 */
import { Sparkles, AlertTriangle, TrendingUp, Activity, Lightbulb, Zap, Layers } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { StatCard } from '../components/DashboardComponents.jsx'

const INSIGHTS = [
  { id: 1, type: 'trend',    title: 'Negative sentiment surge in "Political Stability" cluster', body: 'Three of the four top outlets have shifted to net-negative coverage of coalition stability over the past 48 hours. The strongest signal is in coverage of PM Dahal, which moved from -0.20 to -0.52 in the last week.', entities: ['PM Dahal', 'NC', 'UML'], severity: 'high', icon: TrendingUp },
  { id: 2, type: 'anomaly',  title: 'Ministry of Finance coverage spike', body: 'Article count up 4× in the last 4 hours, with all sources framing the news as a fiscal credibility story. The World Bank GDP forecast is the dominant anchor across all 4 outlets.', entities: ['Finance Ministry', 'NRB', 'World Bank'], severity: 'medium', icon: Activity },
  { id: 3, type: 'pattern',  title: 'Consistent framing of "Economic Reform" as "Risk"', body: '80% of tracked sources frame the economic reform package using the word "risk" in their lede paragraph. This is a clear pattern that suggests an underlying editorial consensus.', entities: ['Economic Reform'], severity: 'low', icon: Lightbulb },
  { id: 4, type: 'alert',    title: 'KP Oli mention volume up 38% week-over-week', body: 'KP Oli has gone from being mentioned in 2 events to 5 events this week. Bias tracking is now active for the next 7 days to monitor tone shifts across all sources.', entities: ['KP Oli', 'UML'], severity: 'medium', icon: AlertTriangle },
  { id: 5, type: 'cluster',  title: 'New mega-cluster forming around Election Reforms', body: 'Six new articles in the last 6 hours are all within 0.91 similarity of a single emerging event. We expect this to crystallize into a top-tier cluster within 24 hours.', entities: ['Election Commission', 'RSP', 'NC'], severity: 'low', icon: Layers },
  { id: 6, type: 'sentiment',title: 'RSP tone shifts positive in OnlineKhabar', body: 'RSP coverage in OnlineKhabar English has shifted from -0.18 to +0.42 over the last 72 hours. The trigger event appears to be the announcement of new coalition agenda items.', entities: ['RSP', 'Rabi Lamichhane'], severity: 'low', icon: Zap },
]

const SEVERITY_MAP = {
  high:   { color: 'red',    icon: AlertTriangle },
  medium: { color: 'yellow', icon: Activity },
  low:    { color: 'brand',  icon: Lightbulb },
}

export default function AIInsights() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="AI Insights | Vantage"
        description="Explainable narrative insights, anomaly detection and pattern analysis."
      />

      <BackButton fallback="/dashboard" />

      <PageHero
        variant="gradient"
        eyebrow={<><Sparkles size={11} /> AI Insights</>}
        title="Explainable narrative insights"
        description="Patterns, anomalies, and trends detected across the Nepali press — every insight with a confidence score and the entities it affects."
        actions={
          <Badge colorScheme="brand" size="lg">
            <Sparkles size={11} /> distilbert-vantage-v1
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active insights"   value="14"   sub="across 7 sources"  icon={Sparkles} accent="brand" />
        <StatCard label="Anomalies"          value="3"    sub="last 24 hours"     icon={AlertTriangle} accent="red" />
        <StatCard label="Patterns"           value="8"    sub="rolling 30 days"   icon={Lightbulb} accent="yellow" />
        <StatCard label="Avg confidence"     value="0.87" sub="model-graded"      icon={Activity} accent="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {INSIGHTS.map((ins, i) => {
          const sev = SEVERITY_MAP[ins.severity] || SEVERITY_MAP.low
          const Icon = ins.icon
          return (
            <Card key={ins.id} variant="elevated" className="anim-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-50)] text-[var(--brand-600)]`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge colorScheme={sev.color} size="sm">{ins.type}</Badge>
                      <Badge colorScheme="gray" size="sm">{ins.severity}</Badge>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-[var(--text)]">{ins.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm leading-relaxed text-[var(--text-soft)]">{ins.body}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[var(--border-subtle)] pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Entities:</span>
                  {ins.entities.map(e => (
                    <span key={e} className="rounded-md bg-[var(--brand-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-700)]">{e}</span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
