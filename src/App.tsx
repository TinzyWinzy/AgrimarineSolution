import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/routes'
import { subscribeToAuth } from '@/services/authService'
import { setupOnlineSync, updatePendingCount, syncNow } from '@/services/syncService'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { usePWA } from '@/hooks/usePWA'
import { validateEnv } from '@/config/env'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
})

function EnvCheck({ children }: { children: React.ReactNode }) {
  const missing = validateEnv()
  if (missing.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-navy-900">Configuration Required</h1>
          <p className="text-gray-600 text-sm">
            The following environment variables are missing:
          </p>
          <ul className="text-sm text-red-600 space-y-1">
            {missing.map((v) => <li key={v}>{v}</li>)}
          </ul>
          <p className="text-xs text-gray-400">
            Copy .env.example to .env and fill in your Firebase credentials.
          </p>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

export default function App() {
  useOnlineStatus()
  usePWA()

  useEffect(() => {
    const unsubAuth = subscribeToAuth()
    const unsubSync = setupOnlineSync()

    updatePendingCount()
    syncNow()

    const interval = setInterval(() => {
      updatePendingCount()
    }, 30000)

    return () => {
      unsubAuth()
      unsubSync()
      clearInterval(interval)
    }
  }, [])

  return (
    <EnvCheck>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </EnvCheck>
  )
}
