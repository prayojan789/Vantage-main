import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'

/**
 * AuthLayout — Chakra-style split-screen auth shell.
 *
 * Left side: a marketing panel with brand + social proof.
 * Right side: the auth form (rendered via <Outlet />).
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ── Left: marketing panel ── */}
        <aside className="relative hidden overflow-hidden bg-brand-gradient lg:flex">
          <div className="absolute inset-0 -z-0 bg-grid-soft opacity-30" aria-hidden="true" />
          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white">
            <Link to="/" className="inline-flex w-fit items-center gap-2.5">
              <Logo size={36} tone="plain" tagline="News Intel · NP" />
            </Link>

            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Welcome back</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
                The whole Nepali press, indexed and explained in seconds.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Vantage clusters articles into events, scores sentiment, and surfaces bias patterns across 7+ publishers — so analysts, journalists, and policy researchers move from signal to insight in a single view.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-white/85">
                {[
                  '8 purpose-built workspaces for every research workflow',
                  'Real-time event clustering, entity sentiment, and bias scoring',
                  'Custom API keys, Slack + Notion + Zapier integrations',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/80" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-white/60">
              © {new Date().getFullYear()} Vantage · Built for newsroom intelligence teams.
            </p>
          </div>
        </aside>

        {/* ── Right: form panel ── */}
        <main className="flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 sm:px-10 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <Logo size={32} showWordmark tagline={null} tone="solid" />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
