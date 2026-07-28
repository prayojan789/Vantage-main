/**
 * ArticleDetail.jsx — Single article reader
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Clock, ExternalLink, Tag, Share2, Bookmark,
  MessageSquare, Quote, Link2, History, Building2,
} from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENT_DETAIL } from '../utils/mockData.js'
import { getArticleById } from '../services/articleService.js'
import { fmtDate, sentimentPill, sourceClass } from '../utils/helpers.js'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cn } from '../lib/utils.js'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null)
      try {
        if (USE_MOCK) {
          const found = MOCK_EVENT_DETAIL.articles.find(a => a.id === id) || MOCK_EVENT_DETAIL.articles[0]
          setArticle(found)
        } else {
          setArticle(await getArticleById(id))
        }
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="skeleton h-16" />
      <div className="skeleton h-96" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-24" />)}
      </div>
    </div>
  )

  if (error || !article) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
      <div className="mb-4 text-4xl">📄</div>
      <h2 className="h-lg">Article not found</h2>
      <p className="mb-6 text-[var(--text-muted)]">The article you are looking for might have been moved or deleted.</p>
      <Button as={Link} to="/articles">Return to Archive</Button>
    </div>
  )

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-20">
      <div className="sticky top-16 z-30 -mx-4 border-b border-[var(--border-subtle)] bg-[var(--surface)]/85 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--green-500)] anim-pulse" />
            <p className="truncate text-xs font-medium text-[var(--text)]">
              <span className="text-[var(--text-muted)]">Summary:</span> {article?.summary?.slice(0, 120)}…
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={sentimentPill(article?.sentiment)} style={{ fontSize: '0.6rem' }}>{article?.sentiment}</span>
            <Link to="/articles" className="ml-2 text-[10px] font-bold text-[var(--brand-600)] hover:underline">Archive</Link>
          </div>
        </div>
      </div>

      <PageMetadata
        title={`${article.headline} | Vantage Reader`}
        description={article.summary}
      />

      <BackButton to="/articles" label="Back to Archive" />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-6 lg:col-span-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('source-tag', sourceClass(article.source))}>{article.source}</span>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Clock size={11} /> {fmtDate(article.published_at)}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight text-[var(--text)]">
              {article.headline}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={sentimentPill(article.sentiment)} style={{ fontSize: '0.7rem' }}>{article.sentiment}</span>
              <span className="text-xs text-[var(--text-muted)]">
                {Math.round((article.sentiment_score ?? 0.5) * 100)}% model confidence
              </span>
              <div className="ml-auto flex flex-wrap gap-2">
                {['Politics', 'Nepal', 'Analysis'].map(tag => (
                  <span key={tag} className="rounded-md bg-[var(--brand-50)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-700)]">#{tag}</span>
                ))}
              </div>
            </div>
          </header>

          <div className="card-elevated p-5">
            <div className="mb-3 flex items-center gap-2">
              <History size={14} className="text-[var(--brand-600)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Contextual timeline</h3>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: 'Initial report', date: '09:15 AM', active: false },
                { label: 'This article',   date: '10:00 AM', active: true  },
                { label: 'Follow-up',      date: '11:10 AM', active: false },
              ].map((step, i, arr) => (
                <div key={i} className="flex flex-shrink-0 items-center gap-3">
                  <div className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold',
                    step.active ? 'bg-[var(--brand-500)] text-white' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]',
                  )}>
                    {i + 1}
                  </div>
                  <div>
                    <p className={cn('text-[10px] font-bold', step.active ? 'text-[var(--text)]' : 'text-[var(--text-muted)]')}>{step.label}</p>
                    <p className="text-[9px] text-[var(--text-muted)]">{step.date}</p>
                  </div>
                  {i < arr.length - 1 ? <div className="h-px w-8 bg-[var(--border)]" /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6 md:p-8">
            <p className="border-l-4 border-[var(--brand-500)] pl-4 text-lg font-medium italic leading-relaxed text-[var(--text)]">
              {article.summary}
            </p>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--text)]">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            </div>

            <div className="mt-8 space-y-3 border-t border-[var(--border-subtle)] pt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                <Quote size={13} /> Citations & Sources
              </div>
              <div className="space-y-2">
                {[
                  '"The coalition partners demand cabinet reshuffle…"',
                  '"Analysts see the reshuffle as normal coalition mechanics…"',
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--text)]">
                    <span>{c}</span>
                    <ExternalLink size={11} className="text-[var(--text-muted)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-6">
              <div className="flex gap-2">
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]" title="Bookmark">
                  <Bookmark size={15} />
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]" title="Share">
                  <Share2 size={15} />
                </button>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] bg-[var(--brand-600)] px-4 h-9 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand-700)]"
              >
                Read original <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </article>

        <aside className="space-y-4 lg:col-span-4">
          <div className="card-elevated p-5">
            <div className="mb-3 flex items-center gap-2">
              <Tag size={14} className="text-[var(--brand-600)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Entity highlights</h3>
            </div>
            <div className="space-y-2">
              {article.entities.map(e => (
                <div
                  key={e.name}
                  className="group flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-2.5 transition-colors hover:border-[var(--brand-200)]"
                >
                  <span className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--brand-600)]">{e.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={sentimentPill(e.sentiment)} style={{ fontSize: '0.6rem' }}>{e.sentiment}</span>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)]">{Math.round(e.score * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-5">
            <div className="mb-3 flex items-center gap-2">
              <Building2 size={14} className="text-[var(--brand-600)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Publisher info</h3>
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
              <p className="text-sm font-bold text-[var(--text)]">{article.source}</p>
              <p className="mt-1 text-[10px] text-[var(--text-muted)]">Verified News Outlet · Nepal</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/publishers" className="text-[10px] font-bold text-[var(--brand-600)] hover:underline">View profile</Link>
                <span className="text-[var(--text-muted)]">·</span>
                <Link to="/articles" className="text-[10px] font-bold text-[var(--brand-600)] hover:underline">More articles</Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-200)] bg-gradient-to-br from-[var(--brand-50)] to-[var(--purple-50)] p-5">
            <div className="flex items-center gap-2 text-[var(--brand-700)]">
              <MessageSquare size={14} />
              <span className="text-xs font-bold">AI insight</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-soft)]">
              This article uses a <strong className="text-[var(--text)]">{article.sentiment}</strong> framing,
              focusing heavily on the actions of {article.entities[0]?.name}.
            </p>
          </div>

          <div className="card-elevated p-5">
            <div className="mb-3 flex items-center gap-2">
              <Link2 size={14} className="text-[var(--brand-600)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Related coverage</h3>
            </div>
            <div className="space-y-2">
              {[1, 2].map(i => (
                <Link
                  key={i}
                  to={`/article/art_00${i}`}
                  className="block rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3 transition-all hover:border-[var(--brand-200)]"
                >
                  <p className="line-clamp-2 text-[11px] font-bold text-[var(--text)]">
                    {article.headline.replace('PM faces', 'Analysis of')}
                  </p>
                  <span className="mt-1 block text-[9px] uppercase text-[var(--text-muted)]">{article.source}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
