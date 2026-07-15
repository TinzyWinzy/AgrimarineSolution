import { auth, db } from '@/config/firebase'
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types'

function mapFirebaseUser(user: FirebaseUser, roleData?: Partial<User>): User {
  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || roleData?.displayName || 'Staff',
    phone: user.phoneNumber || roleData?.phone || '',
    role: roleData?.role || 'staff',
    active: roleData?.active ?? true,
    photoURL: user.photoURL || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
  }
}

export async function loginStaff(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
  if (!userDoc.exists()) {
    throw new Error('Account not found. Contact administrator.')
  }
  const data = userDoc.data() as Record<string, unknown>
  if (data.active === false) {
    throw new Error('Account is deactivated. Contact administrator.')
  }
  const user = mapFirebaseUser(cred.user, data as Partial<User>)
  useAuthStore.getState().setUser(user)
  useAuthStore.getState().setFirebaseUser(cred.user)
  return user
}

export async function logoutStaff() {
  await signOut(auth)
  useAuthStore.getState().logout()
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email)
}

export function subscribeToAuth() {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    const store = useAuthStore.getState()
    if (firebaseUser) {
      store.setFirebaseUser(firebaseUser)
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data() as Record<string, unknown>
          const user = mapFirebaseUser(firebaseUser, data as Partial<User>)
          store.setUser(user)
        } else {
          store.setUser(null)
        }
      } catch {
        store.setUser(null)
      }
    } else {
      store.logout()
    }
    store.setLoading(false)
  })
}

export async function createAdminUser(uid: string, email: string, displayName: string) {
  await setDoc(doc(db, 'users', uid), {
    email,
    displayName,
    role: 'administrator',
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    version: 1,
  })
}
