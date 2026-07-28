import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider.jsx'
import { Button } from '../components/ui/Button.jsx'
import PageMetadata from '../components/PageMetadata.jsx'

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
      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">Don't have an account? <Link to="/sign-up" className="font-semibold text-[var(--color-brand-600)] hover:underline">Create one</Link></p>
    </div>
  )
}