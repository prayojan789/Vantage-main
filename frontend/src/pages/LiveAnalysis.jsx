/**
 * LiveAnalysis.jsx — Live ABSA analysis
 */
import { useState } from 'react'
import {
  Zap,
  Link as LinkIcon,
  AlertCircle,
  Clock,
  Terminal,
  ChevronRight,
  Cpu,
  Sparkles,
  Globe,
  Play,
  RotateCcw,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_ANALYZE } from '../utils/mockData.js'
import { analyzeText } from '../services/sentimentService.js'
import { sentimentColor, sentimentPill } from '../utils/helpers.js'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '../components/ui/Alert.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { motion, AnimatePresence } from 'framer-motion'

const EXAMPLES = [
  { label: 'Kathmandu Post · Cabinet', url: 'https://kathmandupost.com/politics/cabinet-reshuffle', text: "PM Dahal faces mounting pressure as coalition partners demand cabinet reshuffle ahead of winter session." },
  { label: 'Republica · UML',           url: 'https://myrepublica.nagariknetwork.com/uml-congress',   text: "KP Oli re-elected UML chair unanimously at the party's central convention, calling for renewed party unity." },
  { label: 'OnlineKhabar · Economy',     url: 'https://english.onlinekhabar.com/gdp-forecast',        text: "Nepal's GDP is projected to grow at 5.1% according to the World Bank, raising cautious optimism among investors." },
]

const MODEL_INFO = [
  { label: 'Model',         value: 'distilbert-vantage-v1' },
  { label: 'Task',          value: 'Aspect-Based Sentiment' },
  { label: 'Entities',      value: 'Nepali Political NER' },
  { label: 'Inference',     value: 'Local FastAPI · PyTorch' },
  { label: 'Avg latency',   value: '~320ms' },
]

export default function LiveAnalysis() {
  const [text, setText]         = useState('')
  const [url, setUrl]           = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [latency, setLatency]   = useState(null)

  const run = async () => {
    if (!text.trim() && !url.trim()) return
    setLoading(true); setError(null); setResult(null); setLatency(null)
    const t0 = performance.now()
    try {
      const input = text || (url + ' This is a fallback body used in mock mode when a URL is supplied but the live scraper is offline.')
      const data = USE_MOCK
        ? await new Promise(res => setTimeout(() => res(MOCK_ANALYZE(input)), 600 + Math.random() * 400))
        : await analyzeText(input)
      setLatency(Math.round(performance.now() - t0))
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const overallColor = result ? sentimentColor(result.overall_sentiment) : '#f97316'

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Live Analysis | Vantage"
        description="Run aspect-based sentiment analysis on a live URL or pasted text."
      />

      <PageHero
        variant="dark"
        eyebrow={<><Zap size={11} /> Live</>}
        title={<>Live <span className="text-white/70">ABSA</span> analysis</>}
        description="Drop in a URL or paste article text — our fine-tuned model extracts political entities and scores their sentiment in under a second."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            distilbert-vantage-v1
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-1">
          <div className="card-elevated overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-600)] text-white">
                <Terminal size={13} />
              </span>
              <p className="eyebrow text-[var(--brand-700)]">Input</p>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">URL</label>
                <div className="mt-1.5 flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] px-3 focus-within:border-[var(--brand-500)] focus-within:bg-[var(--surface)] focus-within:ring-2 focus-within:ring-[var(--brand-500)]/20">
                  <LinkIcon size={13} className="text-[var(--text-muted)]" />
                  <input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://kathmandupost.com/..."
                    className="h-9 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <span className="flex-1 border-t border-[var(--border)]" />
                or paste text
                <span className="flex-1 border-t border-[var(--border)]" />
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={8}
                placeholder="Paste the article body…"
                className="w-full resize-none rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-3 font-mono text-sm leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--brand-500)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--brand-500)]/20"
              />
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[var(--text-muted)]">{text.length || url.length} chars</p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => { setText(''); setUrl(''); setResult(null) }}
                    variant="outline"
                    size="sm"
                    leftIcon={<RotateCcw size={12} />}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={run}
                    isLoading={loading}
                    disabled={!text.trim() && !url.trim()}
                    leftIcon={<Play size={12} />}
                    size="sm"
                  >
                    Run ABSA
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--orange-50)] text-[var(--orange-700)]">
                <Cpu size={13} />
              </span>
              <p className="eyebrow text-[var(--brand-700)]">Model specs</p>
            </div>
            <ul className="divide-y divide-[var(--border-subtle)] text-xs">
              {MODEL_INFO.map(({ label, value }) => (
                <li key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[var(--text-muted)]">{label}</span>
                  <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[var(--text)]">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--yellow-50)] text-[var(--yellow-600)]">
                <Globe size={13} />
              </span>
              <p className="eyebrow text-[var(--brand-700)]">Try a URL</p>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {EXAMPLES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => { setUrl(ex.url); setText(ex.text); setResult(null) }}
                  className="group flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-[var(--text-muted)] group-hover:text-[var(--brand-600)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--brand-600)]">{ex.label}</p>
                    <p className="line-clamp-1 text-[11px] text-[var(--text-muted)]">{ex.url}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="card-elevated overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] text-white"
                  style={{ background: result ? overallColor : 'var(--purple-500)' }}
                >
                  <Zap size={13} />
                </span>
                <p className="eyebrow text-[var(--brand-700)]">ABSA output</p>
              </div>
              {latency != null ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <Clock size={10} /> {latency}ms
                </span>
              ) : null}
            </div>

            {!loading && !result && !error ? (
              <EmptyState
                icon={Sparkles}
                title="Awaiting input"
                description="Drop a URL or paste the article body. The model is local — runs in <500ms."
                className="border-0 bg-transparent"
              />
            ) : null}

            {loading ? (
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="h-3 w-3 anim-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand-500)]" />
                  Running ABSA model…
                </div>
                {[100, 80, 60].map((h, i) => <div key={i} className="skeleton h-16" />)}
              </div>
            ) : null}

            {error ? (
              <div className="m-6">
                <Alert status="error">
                  <AlertIcon status="error" />
                  <div>
                    <AlertTitle>Request failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </div>
                </Alert>
              </div>
            ) : null}

            {result ? (
              <div className="space-y-6 p-5">
                <div
                  className="relative overflow-hidden rounded-2xl p-5 text-white"
                  style={{ background: `linear-gradient(135deg, ${overallColor}, ${overallColor}cc)` }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Overall sentiment</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold capitalize">{result.overall_sentiment}</span>
                    <span className="text-sm text-white/80">across {result.entities.length} entities</span>
                  </div>
                </div>

                <div>
                  <p className="eyebrow mb-3 text-[var(--brand-700)]">Entity-level sentiment</p>
                  <div className="space-y-3">
                    {result.entities.map(e => (
                      <div key={e.name} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text)]">{e.name}</span>
                            <span className={sentimentPill(e.sentiment)} style={{ fontSize: '0.65rem' }}>{e.sentiment}</span>
                          </div>
                          <span className="text-xs font-semibold text-[var(--text-muted)]">{Math.round(e.score * 100)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${e.score * 100}%`,
                              background: `linear-gradient(90deg, ${sentimentColor(e.sentiment)}, ${sentimentColor(e.sentiment)}99)`,
                            }}
                          />
                        </div>
                        {e.context ? (
                          <p className="mt-2 text-xs italic text-[var(--text-muted)]">{e.context}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
         </div>
      </div>
    </div>
  )
}
