import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router-dom'
import { useEffect } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import NavRail from '../components/layout/NavRail.jsx'
import BottomBar from '../components/layout/BottomBar.jsx'
import Footer from '../components/layout/Footer.jsx'
import MobileNav from '../components/layout/MobileNav.jsx'
import { cn } from '../lib/utils.js'
import { PageContainer } from './PageContainer.jsx'

/**
 * AppLayout variants
 *
 * - `default`  : Top bar + persistent sidebar (recommended for most pages)
 * - `rail`     : Top bar + compact icon-only nav rail (dashboard/workspace)
 * - `full`     : Top bar only (landing, auth, reports)
 * - `focus`    : Sidebar only, no top bar (immersive deep work)
 *
 * The `focus` variant is for the AI Playground / Live Analysis views where
 * vertical space matters more than cross-navigation.
 */
export const LAYOUT_VARIANTS = ['default', 'rail', 'full', 'focus']

const AppLayoutContext = createContext(null)

function AppLayoutProvider({ value, children }) {
  const ctx = useMemo(() => value, [value])
  return <AppLayoutContext.Provider value={ctx}>{children}</AppLayoutContext.Provider>
}

/**
 * AppLayout
 *
 * Top-level layout composition. Renders the chrome appropriate for the
 * current route's `handle.layout` (set in `routes.jsx`), plus a top bar,
 * sidebar, mobile drawer, and footer.
 *
 * Pages are mounted inside the main scroll area via React Router's
 * `<Outlet />`.
 */
export function AppLayout({ variant: variantProp }) {
  const location = useLocation()
  const matches = useMatches()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const routeHandle = [...matches].reverse().find(match => match.handle)?.handle ?? {}
  const variant = variantProp ?? routeHandle.layout ?? 'default'
  const pageWidth = routeHandle.pageWidth ?? 'default'
  const pageFlush = routeHandle.pageFlush ?? false
  const showFooter = routeHandle.footer !== false && variant !== 'focus'

  // Scroll to top on route change so page transitions feel fresh
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [location.pathname])

  const renderChrome = () => {
    const outlet = (
      <PageContainer width={pageWidth} flush={pageFlush}>
        <Outlet />
      </PageContainer>
    )

    switch (variant) {
      case 'full':
        return (
          <>
            <TopBar onMenuClick={() => setDrawerOpen(true)} />
            <main className="flex-1 min-w-0">
              {outlet}
            </main>
            {showFooter ? <Footer /> : null}
            <BottomBar />
          </>
        )
      case 'rail':
        return (
          <>
            <div className="flex flex-1 min-h-0">
              <NavRail />
              <div className="flex-1 min-w-0 flex flex-col">
                <TopBar onMenuClick={() => setDrawerOpen(true)} />
                <main className="flex-1 min-w-0 pb-16 md:pb-0">
                  {outlet}
                </main>
              </div>
            </div>
            <BottomBar />
          </>
        )
      case 'focus':
        return (
          <>
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <main className="flex-1 min-w-0 pb-16 md:pb-0">
                {outlet}
              </main>
            </div>
            <BottomBar />
          </>
        )
      case 'default':
      default:
        return (
          <>
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <div className="flex-1 min-w-0 flex flex-col">
                <TopBar onMenuClick={() => setDrawerOpen(true)} />
                <main className="flex-1 min-w-0 pb-16 md:pb-0">
                  {outlet}
                </main>
                {showFooter ? <Footer /> : null}
              </div>
            </div>
            <BottomBar />
          </>
        )
    }
  }

  return (
    <AppLayoutProvider value={{ variant, drawerOpen, setDrawerOpen }}>
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        {renderChrome()}
      </div>
    </AppLayoutProvider>
  )
}
export default AppLayout;