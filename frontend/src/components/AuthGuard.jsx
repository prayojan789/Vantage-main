import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'
import PageLoading from './PageLoading.jsx'

/**
 * AuthGuard — wraps protected routes and redirects to /sign-in
 * when there is no active session. The originally requested path
 * is preserved in `location.state.from` so the user is sent back
 * after signing in.
 */
export default function AuthGuard({ children }) {
  const { user, hydrated } = useAuth()
  const location = useLocation()

  // Wait for the provider to read localStorage on the first paint
  if (!hydrated) return <PageLoading label="Checking your session…" />

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }
  return children
}
