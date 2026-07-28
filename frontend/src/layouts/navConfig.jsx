import {
  LayoutDashboard,
  BarChart3,
  Zap,
  Newspaper,
  Building2,
  Search,
  Users,
  Sparkles,
  Network,
  Settings,
  Bell,
  Compass,
  LineChart,
  Layers,
  GitCompareArrows,
} from 'lucide-react'

/**
 * Centralised navigation configuration.
 *
 * Sidebar groups + footer page shortcuts.
 */

export const PRIMARY_NAV = [
  { to: '/dashboard', label: 'Dashboard',        icon: LayoutDashboard,  group: 'workspace', description: 'Your news intelligence feed' },
  { to: '/events',    label: 'Event Clusters',   icon: Layers,           group: 'workspace', description: 'Cross-publisher clusters' },
  { to: '/articles',  label: 'Article Archive',  icon: Newspaper,        group: 'workspace', description: 'All ingested articles' },
  { to: '/compare',   label: 'Compare Headlines',icon: GitCompareArrows, group: 'workspace', description: 'Side-by-side coverage comparison' },
]

export const ANALYTICS_NAV = [
  { to: '/bias',       label: 'Bias Dashboard',     icon: BarChart3,  group: 'analytics', description: 'Comparative media bias analysis' },
  { to: '/publishers', label: 'Media Houses',       icon: Building2,  group: 'analytics', description: 'Per-publisher sentiment reports' },
  { to: '/entities',   label: 'Politician Sentiment',icon: Users,     group: 'analytics', description: 'Entity-level sentiment over time' },
  { to: '/analytics',  label: 'Analytics',          icon: LineChart,  group: 'analytics', description: 'Charts, heatmaps & exports' },
  { to: '/graphs',     label: 'Knowledge Graph',    icon: Network,    group: 'analytics', description: 'Entity & relationship map' },
]

export const AI_NAV = [
  { to: '/playground', label: 'AI Playground', icon: Sparkles, group: 'ai', description: 'Run ABSA on any text' },
  { to: '/live',       label: 'Live Analysis', icon: Zap,      group: 'ai', description: 'Run ABSA on a live article' },
  { to: '/insights',   label: 'AI Insights',   icon: Compass,  group: 'ai', description: 'Explainable narrative insights' },
]

export const UTILITY_NAV = [
  { to: '/search',       label: 'Search',       icon: Search,   group: 'utility' },
  { to: '/notifications', label: 'Notifications', icon: Bell,     group: 'utility' },
  { to: '/settings',      label: 'Settings',      icon: Settings, group: 'utility' },
]

/**
 * Footer link groups used by the workspace Footer (in AppLayout).
 * Note: routes promoted into the sidebar are intentionally not duplicated
 * here as standalone link lists — see the workspace Footer for the
 * actual rendered groups.
 */
export const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/events',    label: 'Event Clusters' },
      { to: '/articles',  label: 'Article Archive' },
      { to: '/compare',   label: 'Compare' },
    ],
  },
  {
    title: 'Analytics',
    links: [
      { to: '/bias',       label: 'Bias Dashboard' },
      { to: '/publishers', label: 'Media Houses' },
      { to: '/entities',   label: 'Politician Sentiment' },
      { to: '/analytics',  label: 'Analytics' },
      { to: '/graphs',     label: 'Knowledge Graph' },
    ],
  },
  {
    title: 'AI',
    links: [
      { to: '/playground', label: 'AI Playground' },
      { to: '/live',       label: 'Live Analysis' },
      { to: '/insights',   label: 'AI Insights' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/search',       label: 'Search' },
      { to: '/settings',      label: 'Settings' },
      { to: '/notifications', label: 'Notifications' },
    ],
  },
]

export const SIDEBAR_GROUPS = [
  { id: 'workspace', label: 'Workspace', items: PRIMARY_NAV },
  { id: 'analytics', label: 'Analytics', items: ANALYTICS_NAV },
  { id: 'ai',        label: 'AI Tools',  items: AI_NAV },
  { id: 'utility',   label: 'Account',   items: UTILITY_NAV },
]

export const TRACKED_SOURCES = [
  'The Kathmandu Post',
  'Republica',
  'OnlineKhabar English',
  'The Himalayan Times',
  'My Republica',
  'Setopati English',
  'Nepal Monitor',
]

