// Vivid palette aligned with the new design system
// All colors use CSS custom properties for consistent Light/Dark mode
export const sentimentPill = s =>
  s === 'positive' ? 'pill pill-positive' : s === 'negative' ? 'pill pill-negative' : 'pill pill-neutral'

export const sentimentColor = s =>
  s === 'positive' ? 'var(--color-sentiment-positive)' : s === 'negative' ? 'var(--color-sentiment-negative)' : 'var(--color-sentiment-neutral)'

export const sentimentArrow = s =>
  s === 'positive' ? '↑' : s === 'negative' ? '↓' : '→'

export const fmtDate = iso =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''

export const fmtTime = iso =>
  iso ? new Date(iso).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' }) : ''

export const fmtRelative = iso => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff/60000)}m ago`
  if (h < 24) return `${h}h ago`
  return fmtDate(iso)
}

export const sourceClass = name => {
  if (name?.includes('Kathmandu')) return 'source-tkp'
  if (name?.includes('My Republica')) return 'source-mrep'
  if (name?.includes('Republica')) return 'source-rep'
  if (name?.includes('OnlineKhabar')) return 'source-okh'
  if (name?.includes('Himalayan')) return 'source-hmt'
  if (name?.includes('Setopati')) return 'source-seto'
  if (name?.includes('Monitor')) return 'source-nm'
  return 'source-okh'
}

/**
 * Chart palette — primary orange family + supporting tones.
 * Uses CSS custom properties for consistent Light/Dark mode.
 */
export const CHART_PALETTE = {
  orange:      'var(--color-brand-500)',
  lightOrange: 'var(--color-brand-300)',
  gold:        'var(--color-brand-400)',
  beige:       'var(--color-brand-200)',
  gray:        'var(--color-border-strong)',
  positive:    'var(--color-sentiment-positive)',
  negative:    'var(--color-sentiment-negative)',
  neutral:     'var(--color-sentiment-neutral)',
  blue:        'var(--color-blue-500)',
}

export const CHART_COLORS = [
  CHART_PALETTE.orange,
  CHART_PALETTE.lightOrange,
  CHART_PALETTE.gold,
  CHART_PALETTE.beige,
  CHART_PALETTE.gray,
]
