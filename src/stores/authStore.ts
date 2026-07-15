import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  firebaseUser: import('firebase/auth').User | null
  loading: boolean
  isStaff: boolean
  isAdmin: boolean

  setUser: (user: User | null) => void
  setFirebaseUser: (u: import('firebase/auth').User | null) => void
  setLoading: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  isStaff: false,
  isAdmin: false,

  setUser: (user) => set({
    user,
    isStaff: user?.role === 'staff' || user?.role === 'administrator',
    isAdmin: user?.role === 'administrator',
  }),
  setFirebaseUser: (u) => set({ firebaseUser: u }),
  setLoading: (v) => set({ loading: v }),
  logout: () => set({ user: null, firebaseUser: null, isStaff: false, isAdmin: false }),
}))
