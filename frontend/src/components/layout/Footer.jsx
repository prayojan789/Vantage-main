import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Heart } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import Logo from '../Logo.jsx'
import { FOOTER_LINKS } from '../../layouts/navConfig.jsx'

/**
 * Footer
 *
 * Chakra-style soft footer with brand block, link groups and a
 * small status row.
 * All colors use CSS custom properties for consistent Light/Dark mode.
 */
const SOCIAL = [
  { label: 'GitHub',   href: '#', Icon: Github },
  { label: 'Twitter',  href: '#', Icon: Twitter },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
]

export default function Footer({ className }) {
  return (
    <footer
      className={cn(
        'mt-16 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)]',
        className,
      )}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,_1fr)]">
          <div className="space-y-4">
            <Link to="/dashboard" className="inline-flex items-center gap-2.5">
              <Logo size={36} />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[var(--color-text-muted)]">
              An AI-powered news intelligence platform built to help journalists,
              researchers, and policy analysts understand how Nepali publishers
              cover the same event — at a glance.
            </p>
            <ul className="flex items-center gap-1 pt-1">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
                  >
                    <Icon size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_LINKS.map(group => (
            <div key={group.title}>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-3">
                {group.title}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand-600)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-start gap-2 text-xs sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-1.5">
            © 2026 Vantage · Nepal News Intelligence · Built with <Heart size={11} className="text-[var(--color-danger)]" /> in Kathmandu
          </span>
        </div>
      </div>
    </footer>
  )
}
