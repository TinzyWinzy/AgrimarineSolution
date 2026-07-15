import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import { InstallPrompt } from '@/components/ui/InstallPrompt'
import { ToastContainer } from '@/components/ui/Toast'
import { useAppStore } from '@/stores/appStore'
import { Loader2 } from 'lucide-react'

const HomePage = lazy(() => import('@/pages/public/HomePage'))

const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'))
const SellFishPage = lazy(() => import('@/pages/public/SellFishPage'))
const RequestQuotePage = lazy(() => import('@/pages/public/RequestQuotePage'))
const OrderSuppliesPage = lazy(() => import('@/pages/public/OrderSuppliesPage'))
const BookTrainingPage = lazy(() => import('@/pages/public/BookTrainingPage'))
const TrackPage = lazy(() => import('@/pages/public/TrackPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/public/TermsPage'))
const OfflinePage = lazy(() => import('@/pages/public/OfflinePage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'))
const SubmissionsPage = lazy(() => import('@/pages/app/SubmissionsPage'))
const SubmissionDetailPage = lazy(() => import('@/pages/app/SubmissionDetailPage'))
const CollectionsPage = lazy(() => import('@/pages/app/CollectionsPage'))
const FarmersPage = lazy(() => import('@/pages/app/FarmersPage'))
const FarmerDetailPage = lazy(() => import('@/pages/app/FarmerDetailPage'))
const EnquiriesPage = lazy(() => import('@/pages/app/EnquiriesPage'))
const OrdersPage = lazy(() => import('@/pages/app/OrdersPage'))
const TrainingPage = lazy(() => import('@/pages/app/TrainingPage'))
const PricingPage = lazy(() => import('@/pages/app/PricingPage'))
const NotificationsPage = lazy(() => import('@/pages/app/NotificationsPage'))
const ReportsPage = lazy(() => import('@/pages/app/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'))
const DemoPage = lazy(() => import('@/pages/app/DemoPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-aqua-500" />
    </div>
  )
}

function PublicShell() {
  return (
    <>
      <OfflineBanner />
      <InstallPrompt />
      <Suspense fallback={<PageLoader />}>
        <PublicLayout />
      </Suspense>
      <ToastContainer />
    </>
  )
}

function AppShell() {
  return (
    <>
      <OfflineBanner />
      <Suspense fallback={<PageLoader />}>
        <AppLayout />
      </Suspense>
      <ToastContainer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicShell />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: 'services', element: <Suspense fallback={<PageLoader />}><ServicesPage /></Suspense> },
      { path: 'sell-fish', element: <Suspense fallback={<PageLoader />}><SellFishPage /></Suspense> },
      { path: 'request-quote', element: <Suspense fallback={<PageLoader />}><RequestQuotePage /></Suspense> },
      { path: 'order-supplies', element: <Suspense fallback={<PageLoader />}><OrderSuppliesPage /></Suspense> },
      { path: 'book-training', element: <Suspense fallback={<PageLoader />}><BookTrainingPage /></Suspense> },
      { path: 'track', element: <Suspense fallback={<PageLoader />}><TrackPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense> },
      { path: 'privacy', element: <Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense> },
      { path: 'terms', element: <Suspense fallback={<PageLoader />}><TermsPage /></Suspense> },
      { path: 'offline', element: <Suspense fallback={<PageLoader />}><OfflinePage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense> },
    ],
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
      { path: 'submissions', element: <Suspense fallback={<PageLoader />}><SubmissionsPage /></Suspense> },
      { path: 'submissions/:id', element: <Suspense fallback={<PageLoader />}><SubmissionDetailPage /></Suspense> },
      { path: 'collections', element: <Suspense fallback={<PageLoader />}><CollectionsPage /></Suspense> },
      { path: 'farmers', element: <Suspense fallback={<PageLoader />}><FarmersPage /></Suspense> },
      { path: 'farmers/:id', element: <Suspense fallback={<PageLoader />}><FarmerDetailPage /></Suspense> },
      { path: 'enquiries', element: <Suspense fallback={<PageLoader />}><EnquiriesPage /></Suspense> },
      { path: 'orders', element: <Suspense fallback={<PageLoader />}><OrdersPage /></Suspense> },
      { path: 'training', element: <Suspense fallback={<PageLoader />}><TrainingPage /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<PageLoader />}><PricingPage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<PageLoader />}><ReportsPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
      { path: 'demo', element: <Suspense fallback={<PageLoader />}><DemoPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
