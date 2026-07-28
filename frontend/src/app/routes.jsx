import Landing from '../pages/Landing.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import SignIn from '../pages/SignIn.jsx'
import SignUp from '../pages/SignUp.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Events from '../pages/Events.jsx'
import Articles from '../pages/Articles.jsx'
import ArticleDetail from '../pages/ArticleDetail.jsx'
import EntityExplorer from '../pages/EntityExplorer.jsx'
import MediaHouses from '../pages/MediaHouses.jsx'
import PublisherProfile from '../pages/PublisherProfile.jsx'
import EventDetail from '../pages/EventDetail.jsx'
import BiasReport from '../pages/BiasReport.jsx'
import Analytics from '../pages/Analytics.jsx'
import LiveAnalysis from '../pages/LiveAnalysis.jsx'
import AIPlayground from '../pages/AIPlayground.jsx'
import AIInsights from '../pages/AIInsights.jsx'
import KnowledgeGraph from '../pages/KnowledgeGraph.jsx'
import Search from '../pages/Search.jsx'
import Compare from '../pages/Compare.jsx'
import Notifications from '../pages/Notifications.jsx'
import Settings from '../pages/Settings.jsx'
import AuthGuard from '../components/AuthGuard.jsx'

export const appRoutes = [
  {
    index: true,
    element: <Landing />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
    ],
  },
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'events', element: <Events />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'articles', element: <Articles />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'article/:id', element: <ArticleDetail />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'entities', element: <EntityExplorer />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'publishers', element: <MediaHouses />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'publisher/:id', element: <PublisherProfile />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'event/:id', element: <EventDetail />, handle: { layout: 'full', pageWidth: 'full', pageFlush: true, footer: false } },
      { path: 'bias', element: <BiasReport />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'analytics', element: <Analytics />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'live', element: <LiveAnalysis />, handle: { layout: 'focus', pageWidth: 'wide', footer: false } },
      { path: 'playground', element: <AIPlayground />, handle: { layout: 'focus', pageWidth: 'wide', footer: false } },
      { path: 'insights', element: <AIInsights />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'graphs', element: <KnowledgeGraph />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'search', element: <Search />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'compare', element: <Compare />, handle: { layout: 'default', pageWidth: 'full', pageFlush: true, footer: false } },
      { path: 'notifications', element: <Notifications />, handle: { layout: 'default', pageWidth: 'wide' } },
      { path: 'settings', element: <Settings />, handle: { layout: 'default', pageWidth: 'wide' } },
    ],
  },
]
