import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider.jsx'
import { Button } from '../components/ui/Button.jsx'
import PageMetadata from '../components/PageMetadata.jsx'

function loadGoogleScript() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    document.body.appendChild(script)
  })
}

export default function SignIn() {
  const { signIn, user, hydrated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const signedOut = location.state?.signedOut === true
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { if (hydrated && user) navigate(from, { replace: true }) }, [hydrated, user, from, navigate])

  const clearFieldError = (field) => { if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next }) }

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = 'Please enter a valid email address.'
    if (!password) newErrors.password = 'Password is required.'
    return newErrors
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setErrors({}); setLoading(true)
    const result = await signIn({ email, password, remember })
    if (!result.ok) { setLoading(false); setErrors({ _form: result.error || 'Could not sign in.' }); return }
    setSuccess(true)
    setTimeout(() => navigate(from, { replace: true }), 350)
  }

  return (
    <div>
      <PageMetadata title="Sign in | Vantage" description="Sign in to your Vantage news intelligence workspace." />
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">Welcome back</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">Sign in to your Vantage workspace.</p>
      {signedOut ? <div className="mt-5 flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-3 text-sm text-[var(--color-brand-700)]"><CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" /><span>You've been signed out. Sign in again to continue.</span></div> : null}
      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        {errors._form ? <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] p-3 text-sm text-[var(--color-danger)]"><AlertCircle size={15} className="mt-0.5 flex-shrink-0" /><span>{errors._form}</span></div> : null}
        {success ? <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-sm text-[var(--color-success)]"><Sparkles size={15} className="mt-0.5 flex-shrink-0" /><span>Welcome back! Redirecting to your workspace…</span></div> : null}
        <div>
          <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Work email</label>
          <div className="relative mt-1.5">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input id="email" type="email" autoComplete="email" required value={email} onChange={e => { setEmail(e.target.value); clearFieldError('email') }} placeholder="you@newsroom.np" className={`field-input h-11 w-full pl-9 ${errors.email ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' : ''}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          </div>
          {errors.email ? <p id="email-error" className="mt-1 text-[11px] text-[var(--color-danger)]">{errors.email}</p> : null}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Password</label>
            <Link to="/forgot-password" className="text-[11px] font-semibold text-[var(--color-brand-600)] hover:underline">Forgot?</Link>
          </div>
          <div className="relative mt-1.5">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => { setPassword(e.target.value); clearFieldError('password') }} placeholder="••••••••" className={`field-input h-11 w-full pl-9 pr-10 ${errors.password ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' : ''}`} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} />
            <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
          </div>
          {errors.password ? <p id="password-error" className="mt-1 text-[11px] text-[var(--color-danger)]">{errors.password}</p> : null}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-brand-600)]" /> Keep me signed in for 30 days</label>
        <Button type="submit" size="lg" disabled={loading} rightIcon={loading ? <Loader2 size={14} className="anim-spin" /> : <ArrowRight size={15} />} className="w-full">{loading ? 'Signing you in…' : 'Sign in'}</Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-border-subtle)]" /></div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider text-[var(--color-text-muted)]"><span className="bg-[var(--color-bg)] px-2">or</span></div>
        </div>
        <button
          type="button"
          onClick={async () => {
            setLoading(true)
            await loadGoogleScript()
            const google = window.google
            if (!google?.accounts?.oauth2) {
              setLoading(false)
              return
            }
            const client = google.accounts.oauth2.initCodeClient({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
              scope: 'openid email profile',
              ux_mode: 'popup',
              callback: async (resp) => {
                if (resp.code) {
                  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                      code: resp.code,
                      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
                      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
                      redirect_uri: window.location.origin + window.location.pathname,
                      grant_type: 'authorization_code',
                    }),
                  })
                  const tokenData = await tokenResp.json()
                  if (tokenData.id_token) {
                    const result = await signInWithGoogle(tokenData.id_token)
                    if (!result.ok) {
                      setErrors({ _form: result.error || 'Google sign-in failed.' })
                    }
                  }
                }
                setLoading(false)
              },
            })
            client.requestCode()
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-muted)]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">Don't have an account? <Link to="/sign-up" className="font-semibold text-[var(--color-brand-600)] hover:underline">Create one</Link></p>
    </div>
  )
}