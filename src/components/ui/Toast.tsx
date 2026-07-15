import { create } from 'zustand'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (type: Toast['type'], message: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now().toString()
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-up ${colors[toast.type]}`}
          >
            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
