/**
 * AIPlayground.jsx — Developer playground
 *
 * Developer playground
 */
import { useState } from 'react'
import {
  Zap,
  Clock,
  Terminal,
  ChevronRight,
  Cpu,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Code2,
  Play,
  RotateCcw,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_ANALYZE } from '../utils/mockData.js'
import { analyzeText } from '../services/sentimentService.js'
import { sentimentColor, sentimentPill } from '../utils/helpers.js'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '../components/ui/Alert.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils.js'

const EXAMPLES = [
  {
    label: 'Coalition Tensions',
    text: "PM Dahal met with RSP leader Rabi Lamichhane today, where both parties agreed to review the coalition's six-month agenda. Critics from NC called the meeting unproductive and a distraction from governance.",
  },
  {
    label: 'UML Congress',
    text: "KP Oli addressed thousands of UML cadres in Kathmandu, claiming the party was stronger than ever. Independent mayor Balen Shah dismissed the speech as empty rhetoric from a crumbling establishment.",
  },
  {
    label: 'Economic Report',
    text: "Nepal's GDP is projected to grow at 5.1% according to the World Bank. Finance Minister praised the NRB's monetary policy while opposition leaders questioned whether citizens would feel the benefits.",
  },
  {
    label: 'Judicial Reform',
    text: "The Supreme Court issued a landmark ruling on the electoral threshold, prompting sharp reactions from the Election Commission. RSP leaders welcomed the decision while UML called it judicial overreach.",
  },
]

const MODEL_INFO = [
  { label: 'Model',         value: 'distilbert-vantage-v1' },
  { label: 'Task',          value: 'Aspect-Based Sentiment' },
  { label: 'Entities',      value: 'Nepali Political NER' },
  { label: 'Inference',     value: 'Local FastAPI · PyTorch' },
  { label: 'Avg latency',   value: '~320ms' },
]

export default function AIPlayground() {
  const [text, setText]         = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [copied, setCopied]     = useState(false)
  const [latency, setLatency]   = useState(null)

  const run = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult(null); setLatency(null)
    const t0 = performance.now()
    try {
      const data = USE_MOCK
        ? await new Promise(res => setTimeout(() => res(MOCK_ANALYZE(text)), 600 + Math.random() * 400))
        : await analyzeText(text)
      setLatency(Math.round(performance.now() - t0))
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const overallColor = result ? sentimentColor(result.overall_sentiment) : '#f97316'

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="AI Playground | Vantage"
        description="Developer playground for aspect-based sentiment analysis on Nepali news text."
      />

      <PageHero
        variant="dark"
        eyebrow={<><Sparkles size={11} /> Developer playground</>}
        title={<>AI <span className="text-white/70">Playground</span></>}
        description="Paste any English Nepali news paragraph and inspect what the ABSA model extracts — entities, sentiment scores, and overall tone. Runs entirely on local FastAPI."
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
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-600)] text-white">
                  <Terminal size={13} />
                </span>
                <p className="eyebrow text-[var(--brand-700)]">Request · POST /analyze</p>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">text/* · utf-8</span>
            </div>

            <div className="space-y-3 p-4">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={10}
                placeholder="Paste any Nepali English news paragraph here…"
                className="w-full resize-none rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 font-mono text-sm leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--brand-500)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--brand-500)]/20"
              />

              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[var(--text-muted)]">
                  {text.length} chars · ~{Math.max(1, Math.round(text.length / 5))} tokens
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => { setText(''); setResult(null) }}
                    disabled={!text}
                    variant="outline"
                    size="sm"
                    leftIcon={<RotateCcw size={12} />}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={run}
                    isLoading={loading}
                    disabled={!text.trim()}
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
                <Sparkles size={13} />
              </span>
              <p className="eyebrow text-[var(--brand-700)]">Try an example</p>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {EXAMPLES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => { setText(ex.text); setResult(null) }}
                  className="group flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-[var(--text-muted)] group-hover:text-[var(--brand-600)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--brand-600)]">{ex.label}</p>
                    <p className="line-clamp-2 text-xs text-[var(--text-muted)]">{ex.text}</p>
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
                <p className="eyebrow text-[var(--brand-700)]">Response · 200 OK</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                {latency != null ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={10} /> {latency}ms
                  </span>
                ) : null}
                {result ? (
                  <Badge colorScheme="green" size="sm">{result.entities.length} entities</Badge>
                ) : null}
              </div>
            </div>

            {!loading && !result && !error ? (
              <EmptyState
                icon={Sparkles}
                title="Awaiting input"
                description="Paste a paragraph and click Run ABSA to see entity-level sentiment scores. The model is local and runs in <500ms."
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

            <AnimatePresence>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 p-5"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl p-5 text-white"
                    style={{ background: `linear-gradient(135deg, ${overallColor}, ${overallColor}cc)` }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Overall sentiment</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-bold capitalize">{result.overall_sentiment}</span>
                      <span className="text-sm text-white/80">across {result.entities.length} entities</span>
                    </div>
                    <p className="mt-2 text-sm text-white/90">
                      The model detected a {result.overall_sentiment} framing of the passage,
                      with the strongest negative/positive load on{' '}
                      <strong>{result.entities.sort((a, b) => b.score - a.score)[0]?.name}</strong>.
                    </p>
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
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
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {result ? (
            <div className="card-elevated overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-slate-900 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Code2 size={14} />
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">Raw response</p>
                </div>
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="max-h-80 overflow-auto bg-slate-900 p-4 text-[11px] leading-relaxed text-slate-200">
{JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
