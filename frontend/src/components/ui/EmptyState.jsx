import { cn } from '../../lib/utils.js'

export function EmptyState({ title, description, icon: Icon, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 px-6 py-14 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-brand-600)] shadow-sm">
          <Icon size={24} />
        </div>
      ) : null}
      {title ? (
        <p className="text-base font-semibold text-[var(--color-text)]">{title}</p>
      ) : null}
      {description ? (
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}