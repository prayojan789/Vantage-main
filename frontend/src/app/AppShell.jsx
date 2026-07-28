import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RouteErrorBoundary from '../components/RouteErrorBoundary.jsx'
import PageLoading from '../components/PageLoading.jsx'
import { appRoutes } from './routes.jsx'

const router = createBrowserRouter(
  appRoutes.map(r => ({
    ...r,
    errorElement: <RouteErrorBoundary />,
  })),
)

export default function AppShell() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<PageLoading label="Preparing the Vantage workspace…" />}
    />
  )
}
