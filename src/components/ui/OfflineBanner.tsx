import { useAppStore } from '@/stores/appStore'
import { Wifi, WifiOff, RefreshCw, CloudOff } from 'lucide-react'
import { syncNow } from '@/services/syncService'

export function OfflineBanner() {
  const { isOnline, isSyncing, pendingSyncCount, lastSyncTime, updateAvailable } = useAppStore()

  if (isOnline && !updateAvailable && pendingSyncCount === 0) return null

  return (
    <div className="sticky top-0 z-40">
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          <WifiOff className="h-4 w-4" />
          <span>You are offline. Changes will sync when connected.</span>
        </div>
      )}
      {isOnline && pendingSyncCount > 0 && (
        <div className="flex items-center justify-center gap-2 bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-800">
          <CloudOff className="h-4 w-4" />
          <span>{pendingSyncCount} pending {pendingSyncCount === 1 ? 'item' : 'items'} to sync</span>
          <button
            onClick={() => syncNow()}
            disabled={isSyncing}
            className="flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync now'}
          </button>
        </div>
      )}
      {isOnline && updateAvailable && (
        <div className="flex items-center justify-center gap-2 bg-green-50 border-b border-green-200 px-4 py-2 text-sm text-green-800">
          <RefreshCw className="h-4 w-4" />
          <span>Update available</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-green-600 hover:text-green-800 font-medium"
          >
            Reload
          </button>
        </div>
      )}
    </div>
  )
}
