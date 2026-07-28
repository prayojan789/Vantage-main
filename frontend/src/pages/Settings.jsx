import { useState } from 'react'
import { User, Palette, Bell, Plug, Database, Key, Sun, Moon, Monitor, Trash2, Download, Check, Save, Code2, Sparkles, Building2 } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import BackButton from '../components/BackButton.jsx'
import { useTheme } from '../providers/ThemeProvider.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Switch } from '../components/ui/Switch.jsx'
import { Avatar } from '../components/ui/Avatar.jsx'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { cn } from '../lib/utils.js'

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'api', label: 'API keys', icon: Key },
  { id: 'data', label: 'Data & exports', icon: Database },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [active, setActive] = useState('profile')
  const [prefs, setPrefs] = useState({ emailAlerts: true, weeklyDigest: true, sentimentAlerts: true, sourceAlerts: false })
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata title="Settings | Vantage" description="Profile, appearance, notifications, integrations and API key settings." />
      <BackButton fallback="/dashboard" />
      <PageHero variant="gradient" eyebrow={<><User size={11} /> Settings</>} title="Account & preferences" description="Tune how Vantage looks, what you get notified about, and which data sources feed your workspace." actions={<Button leftIcon={<Save size={14} />} className="bg-white text-[var(--color-brand-700)] hover:bg-white/90">Save changes</Button>} />
      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="card-elevated p-2">
            {SECTIONS.map(s => {
              const Icon = s.icon
              return (
                <button key={s.id} onClick={() => setActive(s.id)} className={cn('flex w-full items-center gap-2.5 rounded-[var(--radius-lg)] px-3 h-10 text-sm font-medium transition-colors', active === s.id ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]')}>
                  <Icon size={15} className={active === s.id ? 'text-[var(--color-brand-600)]' : 'text-[var(--color-text-muted)]'} />
                  {s.label}
                </button>
              )
            })}
          </nav>
        </aside>
        <div className="space-y-6 lg:col-span-9">
          {active === 'profile' ? (
            <Section title="Profile" description="Your public profile and contact details.">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name="Prayojan" size="xl" />
                <div><Button size="sm" leftIcon={<Sparkles size={12} />}>Change photo</Button><p className="mt-1 text-xs text-[var(--color-text-muted)]">PNG, JPG up to 4MB</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" defaultValue="Prayojan" />
                <Field label="Email" defaultValue="prayojan@vantage.np" type="email" />
                <Field label="Role" defaultValue="Newsroom · Research Lead" />
                <Field label="Time zone" defaultValue="Asia / Kathmandu (UTC+5:45)" />
              </div>
              <div className="mt-4"><Field label="Bio" type="textarea" defaultValue="Working on Vantage's newsroom integration. Focused on Nepali political coverage and source diversity." /></div>
            </Section>
          ) : null}
          {active === 'appearance' ? (
            <Section title="Appearance" description="Theme, density and colour preferences.">
              <div>
                <p className="eyebrow mb-3 text-[var(--color-brand-700)]">Theme</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[{ value: 'light', label: 'Light', Icon: Sun, hint: 'High contrast, daylight' }, { value: 'dark', label: 'Dark', Icon: Moon, hint: 'Easier on the eyes' }, { value: 'system', label: 'System', Icon: Monitor, hint: 'Match OS preference' }].map(t => {
                    const Icon = t.Icon
                    const on = theme === t.value
                    return (
                      <button key={t.value} onClick={() => setTheme(t.value)} className={cn('rounded-xl border-2 p-4 text-left transition-all', on ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]/50' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-brand-300)]')}>
                        <div className="flex items-center justify-between"><Icon size={18} className={on ? 'text-[var(--color-brand-600)]' : 'text-[var(--color-text-muted)]'} />{on ? <Check size={14} className="text-[var(--color-brand-600)]" /> : null}</div>
                        <p className="mt-3 text-sm font-bold text-[var(--color-text)]">{t.label}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{t.hint}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </Section>
          ) : null}
          {active === 'notifications' ? (
            <Section title="Notifications" description="Choose what we should email you about.">
              <div className="space-y-3">
                <Toggle label="Email alerts for new event clusters" hint="Triggered the moment a new cluster crosses the similarity threshold." checked={prefs.emailAlerts} onChange={() => toggle('emailAlerts')} />
                <Toggle label="Weekly digest" hint="A summary of the week's top events every Monday morning." checked={prefs.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
                <Toggle label="Sentiment spike alerts" hint="When any entity's tone shifts more than 0.4 in 24 hours." checked={prefs.sentimentAlerts} onChange={() => toggle('sentimentAlerts')} />
                <Toggle label="Source availability alerts" hint="Notify when a tracked publisher goes offline or resumes." checked={prefs.sourceAlerts} onChange={() => toggle('sourceAlerts')} />
              </div>
            </Section>
          ) : null}
          {active === 'integrations' ? (
            <Section title="Integrations" description="Connect Vantage to your newsroom stack.">
              <div className="grid gap-3 sm:grid-cols-2">
                {[{ name: 'Slack', status: 'Connected', desc: 'Receive alerts in #vantage-alerts' }, { name: 'Notion', status: 'Connected', desc: 'Export weekly digests automatically' }, { name: 'Webhook', status: 'Available', desc: 'POST to any URL on new clusters' }, { name: 'Zapier', status: 'Available', desc: 'Connect 5,000+ apps without code' }].map(i => (
                  <div key={i.name} className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3">
                    <div><p className="text-sm font-semibold text-[var(--color-text)]">{i.name}</p><p className="text-[11px] text-[var(--color-text-muted)]">{i.desc}</p></div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', i.status === 'Connected' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]')}>{i.status}</span>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}
          {active === 'api' ? (
            <Section title="API keys" description="Manage programmatic access to Vantage.">
              <div className="space-y-3">
                {[{ name: 'Production key', key: 'vnt_live_*****1f4c', created: '2026-01-12' }, { name: 'Staging key', key: 'vnt_test_*****9a30', created: '2026-04-08' }].map(k => (
                  <div key={k.name} className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-3">
                    <Code2 size={16} className="text-[var(--color-text-muted)]" />
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[var(--color-text)]">{k.name}</p><p className="font-mono text-[11px] text-[var(--color-text-muted)]">{k.key} · created {k.created}</p></div>
                    <Button size="sm" variant="outline" leftIcon={<Key size={11} />}>Rotate</Button>
                  </div>
                ))}
                <Button leftIcon={<Sparkles size={12} />}>Generate new key</Button>
              </div>
            </Section>
          ) : null}
          {active === 'data' ? (
            <Section title="Data & exports" description="Export your data or reset your workspace.">
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-brand-300)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-success-bg)] text-[var(--color-success)]"><Download size={16} /></span>
                    <div className="text-left"><p className="text-sm font-semibold text-[var(--color-text)]">Export all data</p><p className="text-[11px] text-[var(--color-text-muted)]">CSV / JSON dump of all events, articles and entities</p></div>
                  </div>
                  <Check size={14} className="text-[var(--color-text-muted)]" />
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] p-4 transition-colors hover:border-[var(--color-danger)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]"><Trash2 size={16} /></span>
                    <div className="text-left"><p className="text-sm font-semibold text-[var(--color-danger)]">Delete workspace</p><p className="text-[11px] text-[var(--color-danger)]">Permanently delete all data. Cannot be undone.</p></div>
                  </div>
                </button>
              </div>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Section({ title, description, children }) {
  return (
    <Card variant="elevated">
      <CardHeader><div><h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>{description ? <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p> : null}</div></CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}

function Field({ label, defaultValue, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
      {type === 'textarea' ? (
        <textarea defaultValue={defaultValue} rows={3} className="mt-1.5 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/20" />
      ) : (
        <input type={type} defaultValue={defaultValue} className="mt-1.5 h-10 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/20" />
      )}
    </label>
  )
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-colors hover:border-[var(--color-brand-200)]">
      <div><p className="text-sm font-semibold text-[var(--color-text)]">{label}</p><p className="text-[11px] text-[var(--color-text-muted)]">{hint}</p></div>
      <Switch isChecked={checked} onChange={onChange} />
    </div>
  )
}