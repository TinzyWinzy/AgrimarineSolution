import { db } from '@/config/firebase'
import {
  collection, query, where, orderBy, limit, getDocs, getDoc, doc,
  addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp, onSnapshot,
  type QueryConstraint, type DocumentData,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/config/firebase'

const COLLECTIONS = {
  users: 'users',
  farmers: 'farmers',
  fishSubmissions: 'fishSubmissions',
  collectionSchedules: 'collectionSchedules',
  pricingRules: 'pricingRules',
  serviceEnquiries: 'serviceEnquiries',
  products: 'products',
  supplyRequests: 'supplyRequests',
  trainingBookings: 'trainingBookings',
  notifications: 'notifications',
  activityLogs: 'activityLogs',
  settings: 'settings',
  counters: 'counters',
} as const

export async function getRecords(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentData[]> {
  const q = query(collection(db, collectionName), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getRecord(collectionName: string, id: string): Promise<DocumentData | null> {
  const snap = await getDoc(doc(db, collectionName, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createRecord(collectionName: string, data: Record<string, unknown>): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    version: 1,
  })
  return docRef.id
}

export async function updateRecord(collectionName: string, id: string, data: Record<string, unknown>): Promise<void> {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
    version: (data.version as number || 0) + 1,
  })
}

export async function deleteRecord(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id))
}

export function subscribeToCollection(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (records: DocumentData[]) => void
) {
  const q = query(collection(db, collectionName), ...constraints)
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

export async function uploadFile(path: string, file: File | Blob): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export { COLLECTIONS, Timestamp, serverTimestamp }
