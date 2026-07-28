import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Layers, BarChart3, Building2, Users, Search, GitCompareArrows, Zap, Globe2, Workflow, FileSearch, ScanSearch, Layers3, ChevronRight, Cpu, ShieldCheck, Database, Server, Code2, Brain, BookOpen, GraduationCap, Newspaper, Lightbulb, CheckCircle2, XCircle, Plus, Minus, Github, Linkedin, Mail, Twitter, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils.js'
import PageMetadata from '../components/PageMetadata.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Avatar } from '../components/ui/Avatar.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../providers/AuthProvider.jsx'

const USE_CASES = [
  { id: 1, title: 'View news feed', desc: 'Monitor live, clustered news coverage with sentiment insights.', icon: Layers, to: '/dashboard' },
  { id: 2, title: 'Search articles', desc: 'Search across news events, articles, publishers, and entities.', icon: Search, to: '/search' },
  { id: 3, title: 'Compare headlines', desc: 'Compare how different publishers frame and report the same event.', icon: GitCompareArrows, to: '/compare' },
  { id: 4, title: 'Explore event clusters', desc: 'Discover related articles grouped into meaningful news events.', icon: Layers, to: '/events' },
  { id: 5, title: 'Analyze entity sentiment', desc: 'Track sentiment surrounding politicians, institutions, and organizations.', icon: Users, to: '/entities' },
  { id: 6, title: 'Review publisher reports', desc: 'Examine publisher-level sentiment, coverage patterns, and trends.', icon: Building2, to: '/publishers' },
  { id: 7, title: 'Explore bias insights', desc: 'Identify differences in tone, framing, and coverage across publishers.', icon: BarChart3, to: '/bias' },
  { id: 8, title: 'Use the AI playground', desc: 'Run aspect-based sentiment analysis on custom text in real time.', icon: Zap, to: '/playground' },
]

const FEATURES = [
  { title: 'Clustered event intelligence', description: 'Group related articles into unified events and compare how publishers report the same story.', icon: Layers3 },
  { title: 'Entity-level sentiment analysis', description: 'Track sentiment toward politicians, organizations, institutions, and other key entities.', icon: ScanSearch },
  { title: 'Media bias analysis', description: 'Evaluate sentiment distribution, framing differences, and publisher-level coverage patterns.', icon: BarChart3 },
  { title: 'Knowledge graph', description: 'Explore relationships between people, organizations, publishers, topics, and news events.', icon: Globe2 },
  { title: 'Live ABSA playground', description: 'Analyze custom text and inspect aspect-based sentiment results with immediate feedback.', icon: Workflow },
  { title: 'Research-ready insights', description: 'Transform complex news data into structured insights for research, reporting, and decision-making.', icon: FileSearch },
]

const STATS = [{ value: '12k+', label: 'Articles processed' }, { value: '4.2k', label: 'Entity relationships' }, { value: '94%', label: 'Analysis accuracy' }, { value: '150+', label: 'Daily insights' }]

const TRUST_POINTS = [{ icon: Cpu, label: 'AI-powered NLP pipeline' }, { icon: Zap, label: 'Real-time news analysis' }, { icon: Layers, label: 'Multi-source comparison' }, { icon: GraduationCap, label: 'Research-grade outputs' }]

const PROBLEMS = [
  { title: 'Every publisher frames the story differently.', desc: 'Tone, word choice, and emphasis vary even when reporting the same event.' },
  { title: 'Hidden bias shapes public opinion.', desc: 'Subtle framing can mislead readers and distort debates.' },
  { title: 'Comparing dozens of articles takes hours.', desc: 'Manual cross-publisher analysis is slow, repetitive, and error-prone.' },
  { title: 'Analysts lack objective, reusable tools.', desc: 'Most tools stop at keyword search — they don\u2019t measure sentiment or framing.' },
]

const SOLUTION_STEPS = [
  { icon: Newspaper, title: 'Collect articles', desc: 'Ingest articles from 50+ Nepali news publishers automatically.' },
  { icon: Layers, title: 'Cluster events', desc: 'Group related coverage into unified story clusters.' },
  { icon: ScanSearch, title: 'Extract entities', desc: 'Identify people, organizations, parties, and locations.' },
  { icon: Brain, title: 'Score sentiment', desc: 'Run aspect-based sentiment analysis on every article.' },
  { icon: BarChart3, title: 'Detect bias', desc: 'Compare framing and tone across publishers.' },
  { icon: Workflow, title: 'Visualize insights', desc: 'Expose findings through interactive dashboards and reports.' },
]

const BENEFITS = [
  'Save hours of manual cross-publisher comparison', 'Compare how every outlet frames the same event',
  'Detect hidden sentiment shifts in real time', 'Identify framing differences backed by evidence',
  'Export research-ready reports and citations', 'Make editorial and policy decisions with confidence',
]

const TECH_STACK = [
  { group: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS'] },
  { group: 'Backend', items: ['FastAPI', 'Python'] },
  { group: 'AI / ML', items: ['DistilBERT', 'spaCy', 'Hugging Face Transformers'] },
  { group: 'Data', items: ['PostgreSQL', 'Redis'] },
  { group: 'Infra', items: ['Docker', 'Render / Vercel'] },
]

const FAQ_ITEMS = [
  { q: 'How does bias detection work?', a: 'Vantage combines aspect-based sentiment analysis, entity recognition, and cross-publisher comparison to surface framing, tone, and coverage differences. Every insight links back to source articles for transparency.' },
  { q: 'Which publishers are supported?', a: 'The platform ingests 50+ Nepali English-language news outlets and is being expanded to include Nepali-language sources and additional regional publishers.' },
  { q: 'Is the analysis real-time?', a: 'Yes. The pipeline continuously ingests new articles, re-clusters events, and re-scores sentiment so dashboards reflect the latest coverage.' },
  { q: 'Can I export reports?', a: 'All dashboards and bias reports can be exported as PDF or CSV for research, briefing, and publication.' },
  { q: 'Is Vantage suitable for academic research?', a: 'Yes. The system is designed for research-grade analysis with traceable sources, reproducible metrics, and citation-ready outputs.' },
]

const TIMELINE = [
  { date: 'Q1 2025', title: 'Foundation', text: 'Development of the core news ingestion pipeline and named entity recognition system.' },
  { date: 'Q3 2025', title: 'Intelligence', text: 'Integration of aspect-based sentiment analysis and event clustering capabilities.' },
  { date: 'Q1 2026', title: 'Expansion', text: 'Support for additional publishers, entities, and knowledge graph relationships.' },
  { date: 'Q3 2026', title: 'Refinement', text: 'Advanced media bias reporting, comparative analytics, and research-ready tools.' },
]

export default function Landing() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleSignOut = async () => { try { await signOut(); navigate('/sign-in', { replace: true, state: { signedOut: true } }) } catch (error) { console.error('Unable to sign out:', error) } }

  const NAV_ITEMS = ['Features', 'Use cases', 'Workflow', 'Technology', 'FAQ']

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <PageMetadata title="Vantage — AI-Powered News Intelligence" description="Vantage provides AI-powered event clustering, entity-level sentiment analysis, and media bias detection across Nepal's leading news publishers." />
      <header className="sticky top-0 z-30 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Go to Vantage homepage"><Logo size={36} /></Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden items-center gap-1 md:flex">{NAV_ITEMS.map(item => <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex h-9 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]">{item}</a>)}</nav>

          {/* Mobile hamburger — visible only on small screens */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] md:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden h-9 items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-text)] sm:inline-flex"><Avatar name={user.name || user.email} size="xs" />{user.name || user.email}</span>
                <Button as={Link} to="/dashboard" rightIcon={<ArrowRight size={14} />}>Open workspace</Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="hidden h-9 items-center text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] sm:inline-flex">Sign in</Link>
                <Button as={Link} to="/sign-up" rightIcon={<ArrowRight size={14} />}>Create account</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile sliding nav panel — slides down/up */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <nav className="flex flex-col gap-1 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-4">
            {NAV_ITEMS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-soft" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[var(--color-brand-50)]/50 to-transparent" />
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="h-display max-w-4xl">AI-Powered News Intelligence for <span className="bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-400)] bg-clip-text text-transparent">Smarter Media Analysis</span></h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">Vantage helps researchers, journalists, and decision-makers understand how news is reported across Nepal's leading publishers. By combining event clustering, entity-level sentiment analysis, and media bias detection, the platform delivers accurate, transparent, and data-driven insights from complex news coverage.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/dashboard" size="lg" rightIcon={<ArrowRight size={16} />}>Open the workspace</Button>
              <Button as={Link} to="/playground" size="lg" variant="outline" className="btn-landing-playground">Try the AI playground</Button>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">{STATS.map(stat => <div key={stat.label} className="card-elevated p-4 text-center"><p className="h-lg bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-400)] bg-clip-text text-transparent">{stat.value}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">{stat.label}</p></div>)}</div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-10">
        <div className="mx-auto max-w-[1280px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">Built for research-grade analysis</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">{TRUST_POINTS.map(({ icon: Icon, label }) => <div key={label} className="flex items-center justify-center gap-2.5 text-sm font-semibold text-[var(--color-text-muted)]"><span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)]"><Icon size={16} /></span>{label}</div>)}</div>
        </div>
      </section>

      <section id="problem" className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">The problem</p>
            <h2 className="mt-3 h-display">News is everywhere. <br className="hidden sm:block" />But understanding it is hard.</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Modern newsrooms produce more coverage than any analyst can read. Hidden in that volume is the story of how the same event gets framed, softened, or sharpened by different publishers.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">{PROBLEMS.map(({ title, desc }) => <div key={title} className="card-elevated flex gap-4 p-5"><span className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]"><XCircle size={18} /></span><div><h3 className="text-base font-bold text-[var(--color-text)]">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{desc}</p></div></div>)}</div>
        </div>
      </section>

      <section id="solution" className="bg-[var(--color-surface-muted)]/50 py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">The solution</p>
            <h2 className="mt-3 h-display">Vantage turns coverage into clarity</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">A single workspace that automatically collects, clusters, scores, and compares how every story is reported — so you can move from raw articles to evidence-based insight in minutes.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{SOLUTION_STEPS.map(({ icon: Icon, title, desc }) => <div key={title} className="card-elevated p-6"><span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-purple-50)] text-[var(--color-brand-600)]"><Icon size={20} /></span><h3 className="mt-4 text-base font-bold text-[var(--color-text)]">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{desc}</p></div>)}</div>
        </div>
      </section>

      <section id="use-cases" className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">Use cases</p>
            <h2 className="mt-3 h-display">Powerful tools for modern media analysis</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Explore live news coverage, compare publisher narratives, analyze sentiment, and uncover potential media bias through one intelligent workspace.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{USE_CASES.map(useCase => { const Icon = useCase.icon; return (<Link key={useCase.id} to={useCase.to} className="group card-elevated relative overflow-hidden p-5 anim-fade-up"><span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)] transition-transform group-hover:scale-110"><Icon size={18} /></span><h3 className="mt-3 text-base font-bold text-[var(--color-text)]">{useCase.title}</h3><p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{useCase.desc}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-600)] opacity-0 transition-opacity group-hover:opacity-100">Open<ChevronRight size={12} /></span></Link>)})}</div>
        </div>
      </section>

      <section id="features" className="bg-[var(--color-surface-muted)]/50 py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">Features</p>
            <h2 className="mt-3 h-display">A complete news intelligence platform</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Vantage combines advanced artificial intelligence and structured analytics to transform fragmented reporting into meaningful insights.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map((feature, index) => { const Icon = feature.icon; return (<div key={feature.title} className="card-elevated p-6 anim-fade-up" style={{ animationDelay: `${index * 0.05}s` }}><span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-purple-50)] text-[var(--color-brand-600)]"><Icon size={20} /></span><h3 className="mt-4 text-base font-bold text-[var(--color-text)]">{feature.title}</h3><p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{feature.description}</p></div>)})}</div>
        </div>
      </section>

      <section id="workflow" className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">How it works</p>
            <h2 className="mt-3 h-display">From raw articles to evidence in minutes</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">The Vantage pipeline continuously ingests, organizes, and analyzes news so you can focus on what the data is telling you.</p>
          </div>
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{SOLUTION_STEPS.map(({ icon: Icon, title, desc }, index) => <div key={title} className="card-elevated relative p-5"><div className="flex items-center gap-3"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-600)] text-xs font-bold text-[var(--color-text-inverse)]">{index + 1}</span><span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)]"><Icon size={18} /></span></div><h3 className="mt-4 text-base font-bold text-[var(--color-text)]">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{desc}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section id="preview" className="bg-[var(--color-surface-muted)]/50 py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">Inside the workspace</p>
            <h2 className="mt-3 h-display">See bias, sentiment, and coverage at a glance</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Every dashboard is built around the questions analysts actually ask — with the evidence one click away.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="card-elevated overflow-hidden p-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">Dashboard</p><p className="text-base font-bold text-[var(--color-text)]">Cross-publisher bias</p></div>
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--color-success-bg)] px-2.5 text-xs font-semibold text-[var(--color-success)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />Live</span>
              </div>
              <div className="mt-4 space-y-3">
                {[{ name: 'Republica', pct: 72, color: 'bg-[var(--color-brand-500)]' }, { name: 'The Himalayan', pct: 58, color: 'bg-[var(--color-brand-400)]' }, { name: 'Kathmandu Post', pct: 46, color: 'bg-[var(--color-brand-300)]' }, { name: 'Nepali Times', pct: 34, color: 'bg-[var(--color-brand-200)]' }].map(row => (
                  <div key={row.name}><div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text)]">{row.name}</span><span>{row.pct}%</span></div><div className="mt-1 h-2 w-full rounded-full bg-[var(--color-surface-muted)]"><div className={`h-2 rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} /></div></div>
                ))}
              </div>
            </div>
            <div className="card-elevated overflow-hidden p-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">Entity</p><p className="text-base font-bold text-[var(--color-text)]">Sentiment over time</p></div>
                <span className="text-xs text-[var(--color-text-muted)]">Last 30 days</span>
              </div>
              <div className="mt-4 flex h-40 items-end gap-1.5">{[40, 55, 48, 62, 58, 70, 65, 72, 68, 75, 60, 66, 78, 82, 74, 80, 72, 68, 75, 80, 84, 78, 82, 88, 76, 80, 84, 90, 82, 86].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[var(--color-brand-500)] to-[var(--color-brand-400)]" style={{ height: `${h}%` }} />)}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]"><span>Apr 1</span><span>Apr 15</span><span>Apr 30</span></div>
            </div>
            <div className="card-elevated overflow-hidden p-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">Event cluster</p><p className="text-base font-bold text-[var(--color-text)]">Federal budget 2026</p></div>
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--color-brand-50)] px-2.5 text-xs font-semibold text-[var(--color-brand-700)]">42 articles</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {[{ pub: 'Republica', tone: 'Critical', dot: 'bg-[var(--color-danger)]' }, { pub: 'The Himalayan', tone: 'Analytical', dot: 'bg-[var(--color-brand-500)]' }, { pub: 'Kathmandu Post', tone: 'Neutral', dot: 'bg-[var(--color-text-subtle)]' }, { pub: 'Nepali Times', tone: 'Supportive', dot: 'bg-[var(--color-success)]' }].map(row => (
                  <div key={row.pub} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm"><span className="font-semibold text-[var(--color-text)]">{row.pub}</span><span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]"><span className={`h-2 w-2 rounded-full ${row.dot}`} />{row.tone}</span></div>
                ))}
              </div>
            </div>
            <div className="card-elevated overflow-hidden p-5">
              <div className="border-b border-[var(--color-border-subtle)] pb-3"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">Today</p><p className="text-base font-bold text-[var(--color-text)]">Pipeline summary</p></div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[{ label: 'New articles', value: '128', delta: '+12%' }, { label: 'New clusters', value: '7', delta: '+2' }, { label: 'Entities found', value: '342', delta: '+18%' }, { label: 'Bias flags', value: '5', delta: '-1' }].map(kpi => (
                  <div key={kpi.label} className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-3"><p className="text-xs text-[var(--color-text-muted)]">{kpi.label}</p><p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{kpi.value}</p><p className="mt-0.5 text-xs font-semibold text-[var(--color-brand-600)]">{kpi.delta}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div><p className="eyebrow text-[var(--color-brand-700)]">Why Vantage</p><h2 className="mt-3 h-display">Better questions, backed by evidence</h2><p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Vantage is built for the people who have to answer "why is coverage so different?" — and need to show their work.</p></div>
            <ul className="space-y-3">{BENEFITS.map(benefit => <li key={benefit} className="card-elevated flex items-start gap-3 p-4"><span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)]"><CheckCircle2 size={14} /></span><span className="text-sm font-semibold text-[var(--color-text)]">{benefit}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section id="technology" className="bg-[var(--color-surface-muted)]/50 py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">Technology</p>
            <h2 className="mt-3 h-display">Built on a modern, research-grade stack</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Open tooling, proven models, and a clean separation between the web workspace and the AI pipeline.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{TECH_STACK.map(({ group, items }) => <div key={group} className="card-elevated p-5"><p className="eyebrow text-[var(--color-brand-700)]">{group}</p><ul className="mt-3 space-y-2">{items.map(tech => <li key={tech} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />{tech}</li>)}</ul></div>)}</div>
        </div>
      </section>

      <section id="stats" className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-3xl text-center"><p className="eyebrow text-[var(--color-brand-700)]">By the numbers</p><h2 className="mt-3 h-display">Already processing news at scale</h2></div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">{STATS.map(stat => <div key={stat.label} className="card-elevated p-4 text-center"><p className="h-lg bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-400)] bg-clip-text text-transparent">{stat.value}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">{stat.label}</p></div>)}</div>
        </div>
      </section>

      <section id="faq" className="bg-[var(--color-surface-muted)]/50 py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--color-brand-700)]">FAQ</p>
            <h2 className="mt-3 h-display">Frequently asked questions</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">Quick answers to the most common questions about how Vantage works.</p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl space-y-3">{FAQ_ITEMS.map(item => <details key={item.q} className="card-elevated group p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-bold text-[var(--color-text)]"><span>{item.q}</span><span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] transition-transform group-open:rotate-180"><Plus size={14} /></span></summary><p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{item.a}</p></details>)}</div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="bg-brand-gradient relative overflow-hidden rounded-3xl p-10 text-center text-white shadow-2xl md:p-16">
            <h2 className="h-display text-white">Discover the intelligence behind the headlines</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/80">Explore clustered events, compare publisher perspectives, analyze entity sentiment, and uncover media bias through one intelligent platform.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/dashboard" size="lg" rightIcon={<ArrowRight size={16} />} className="bg-white text-[var(--color-brand-700)] hover:bg-white/90">Open the workspace</Button>
              <Button as={Link} to="/playground" size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/20 hover:text-white btn-landing-playground">Try the AI playground</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4"><Logo size={32} tagline={null} /><p className="text-sm">© 2026 Vantage · Nepal News Intelligence</p></div>
            <div className="flex items-center gap-4">
              {[{ Icon: Github, href: '#' }, { Icon: Twitter, href: '#' }, { Icon: Linkedin, href: '#' }].map(({ Icon, href }) => <a key={href} href={href} className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"><Icon size={16} /></a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}