import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './ui/Button.jsx'

/**
 * RouteErrorBoundary
 *
 * Top-level error boundary that catches router / page errors and
 * shows a polished fallback.
 */
export default class RouteErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Route error:', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--red-50)] text-[var(--red-600)]">
          <AlertTriangle size={24} />
        </div>
        <h1 className="h-lg">Something went wrong</h1>
        <p className="max-w-md text-sm text-[var(--text-muted)]">
          {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <div className="flex items-center gap-2">
          <Button leftIcon={<RefreshCw size={14} />} onClick={this.reset}>Try again</Button>
          <Button as={Link} to="/dashboard" variant="outline" leftIcon={<Home size={14} />}>Home</Button>
        </div>
      </div>
    )
  }
}
