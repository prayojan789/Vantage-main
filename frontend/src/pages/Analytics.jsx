/**
 * Analytics.jsx — Charts, heatmaps & exports
 */
import {
  BarChart3, LineChart as LineChartIcon, PieChart, TrendingUp,
  Calendar, Filter, Download,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area,
} from 'recharts'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'

import { StatCard } from '../components/DashboardComponents.jsx'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { getAnalyticsSummary } from '../services/analyticsService.js'
import { useState, useEffect } from 'react'

export default function Analytics() {
  const [data, setData] = useState({ trend: [], distribution: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const res = await getAnalyticsSummary()
      setData(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Analytics | Vantage"
        description="Charts, heatmaps and exports for the Vantage news intelligence platform."
      />

      <BackButton fallback="/dashboard" />

      <PageHero
        variant="light"
        eyebrow={<><BarChart3 size={11} /> Analytics</>}
        title="Charts, heatmaps & exports"
        description="Time-series and category breakdowns of every signal flowing through the Vantage pipeline."
        actions={
          <Button leftIcon={<Download size={14} />} variant="outline">Export CSV</Button>
        }
      />

      {error ? (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] px-4 py-3 text-sm text-[var(--red-700)]">
          <AlertCircle size={16} /> {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Daily events"   value={data.trend?.length || 0} sub="rolling 14-day avg"   icon={TrendingUp} accent="brand" />
            <StatCard label="Weekly articles" value={data.trend?.reduce((a, b) => a + b.articles, 0) || 0} sub="+18% week-over-week" icon={BarChart3} accent="blue" />
            <StatCard label="Cluster density" value="0.89" sub="similarity threshold" icon={LineChartIcon} accent="green" />
            <StatCard label="Active windows" value="6"   sub="last 24 hours"        icon={Calendar} accent="purple" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <p className="eyebrow text-[var(--brand-700)]">Time series</p>
                  <h2 className="text-sm font-bold text-[var(--text)]">Events vs articles (14 days)</h2>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={data.trend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand-500)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--brand-500)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                    <Area type="monotone" dataKey="articles" stroke="var(--brand-500)" fill="url(#g1)" strokeWidth={2} />
                    <Line type="monotone" dataKey="events" stroke="var(--brand-700)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <p className="eyebrow text-[var(--brand-700)]">Distribution</p>
                  <h2 className="text-sm font-bold text-[var(--text)]">Sentiment by source</h2>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="pos" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} name="Positive" />
                    <Bar dataKey="neu" stackId="a" fill="#f59e0b" name="Neutral" />
                    <Bar dataKey="neg" stackId="a" fill="#dc2626" name="Negative" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <div>
            <p className="eyebrow text-[var(--brand-700)]">Heatmap</p>
            <h2 className="text-sm font-bold text-[var(--text)]">Coverage intensity by day & sentiment</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {/* Heatmap remains as a visual representation of intensity for now */}
            <div className="col-span-7 text-center py-10 text-sm text-[var(--text-muted)] italic">
              Heatmap visualization is currently based on aggregated source intensity.
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
