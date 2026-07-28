import AppShell from './app/AppShell.jsx'
import { AuthProvider } from './providers/AuthProvider.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
