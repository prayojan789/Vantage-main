import { cn } from '../lib/utils.js'

export default function PageHero({ variant = 'gradient', eyebrow, title, description, actions, visual, className, children }) {
  if (variant === 'light' || variant === 'soft') {
    return (
      <section className={cn('bg-brand-soft relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] p-6 shadow-sm md:p-8', className)}>
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            {eyebrow ? <div className="eyebrow mb-3 text-[var(--color-brand-700)]">{eyebrow}</div> : null}
            {title ? <h1 className="h-display">{title}</h1> : null}
            {description ? <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">{description}</p> : null}
            {children}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
        {visual ? <div className="relative z-10 mt-6">{visual}</div> : null}
      </section>
    )
  }

  if (variant === 'dark') {
    return (
      <section className={cn('bg-dark-gradient relative overflow-hidden rounded-2xl p-6 text-white shadow-xl md:p-8', className)}>
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 max-w-2xl">
            {eyebrow ? <div className="eyebrow mb-3 text-orange-200">{eyebrow}</div> : null}
            {title ? <h1 className="h-display text-white">{title}</h1> : null}
            {description ? <p className="mt-2 text-sm text-[var(--color-text-inverse)]/85 sm:text-base">{description}</p> : null}
            {children}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
        {visual ? <div className="relative z-10 mt-6">{visual}</div> : null}
      </section>
    )
  }

  return (
    <section className={cn('bg-brand-gradient relative overflow-hidden rounded-2xl p-6 text-white shadow-xl md:p-8', className)}>
      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">{eyebrow}</span> : null}
          {title ? <h1 className="h-display text-white">{title}</h1> : null}
          {description ? <p className="mt-2 text-sm text-white/85 sm:text-base">{description}</p> : null}
          {children}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {visual ? <div className="relative z-10 mt-6">{visual}</div> : null}
    </section>
  )
}