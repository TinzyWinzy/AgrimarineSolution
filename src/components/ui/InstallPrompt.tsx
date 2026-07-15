import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

export function InstallPrompt() {
  const { isInstallable, deferredPrompt, setInstallable, setDeferredPrompt } = useAppStore()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallable(true)
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [setInstallable, setDeferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    ;(deferredPrompt as unknown as { prompt: () => Promise<void> }).prompt()
    const result = await (deferredPrompt as unknown as { userChoice: Promise<{ outcome: string }> }).userChoice
    if (result.outcome === 'accepted') {
      setInstallable(false)
      setDeferredPrompt(null)
    }
  }

  if (!isInstallable || dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-slide-up">
      <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 p-1">
        <X className="h-4 w-4 text-gray-400" />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-aqua-100 rounded-lg">
          <Download className="h-5 w-5 text-aqua-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-navy-900 text-sm">Install Agrimarine</p>
          <p className="text-xs text-gray-500 mt-0.5">Add to your home screen for quick access offline</p>
          <button
            onClick={handleInstall}
            className="mt-2 px-4 py-1.5 bg-aqua-500 text-white text-sm rounded-lg hover:bg-aqua-400 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
