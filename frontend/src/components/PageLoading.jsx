import { Sparkles } from 'lucide-react'

/**
 * PageLoading
 *
 * A soft, branded full-page loading state.
 */
export default function PageLoading({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fdba74] text-white shadow-lg shadow-[#f59e0b]/30">
        <Sparkles size={20} className="anim-pulse" />
      </div>
      <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
    </div>
  )
}
