import { create } from 'zustand'

interface AppState {
  isOnline: boolean
  isSyncing: boolean
  pendingSyncCount: number
  lastSyncTime: number | null
  updateAvailable: boolean
  isInstallable: boolean
  deferredPrompt: Event | null

  setOnline: (v: boolean) => void
  setSyncing: (v: boolean) => void
  setPendingSyncCount: (v: number) => void
  setLastSyncTime: (v: number) => void
  setUpdateAvailable: (v: boolean) => void
  setInstallable: (v: boolean) => void
  setDeferredPrompt: (v: Event | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: navigator.onLine,
  isSyncing: false,
  pendingSyncCount: 0,
  lastSyncTime: null,
  updateAvailable: false,
  isInstallable: false,
  deferredPrompt: null,

  setOnline: (v) => set({ isOnline: v }),
  setSyncing: (v) => set({ isSyncing: v }),
  setPendingSyncCount: (v) => set({ pendingSyncCount: v }),
  setLastSyncTime: (v) => set({ lastSyncTime: v }),
  setUpdateAvailable: (v) => set({ updateAvailable: v }),
  setInstallable: (v) => set({ isInstallable: v }),
  setDeferredPrompt: (v) => set({ deferredPrompt: v }),
}))
