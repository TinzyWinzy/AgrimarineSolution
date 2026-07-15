import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="text-center max-w-md">
        <WifiOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-navy-900 mb-2">You Are Offline</h1>
        <p className="text-gray-600 text-sm mb-6">
          Some features require an internet connection. You can still access previously loaded pages and submit forms offline.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-aqua-500 text-white rounded-lg hover:bg-aqua-400 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    </div>
  )
}
