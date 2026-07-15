import { useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'

export function usePWA() {
  const { setUpdateAvailable } = useAppStore()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handler = () => {
        setUpdateAvailable(true)
      }
      navigator.serviceWorker.addEventListener('controllerchange', handler)
      return () => navigator.serviceWorker.removeEventListener('controllerchange', handler)
    }
  }, [setUpdateAvailable])

  useEffect(() => {
    const handleAppInstalled = () => {
      useAppStore.getState().setInstallable(false)
    }
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => window.removeEventListener('appinstalled', handleAppInstalled)
  }, [])
}
