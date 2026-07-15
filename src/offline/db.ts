import { openDB, type IDBPDatabase } from 'idb'
import type { SyncQueueItem } from '@/types'

const DB_NAME = 'agrimarine-offline'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pendingFishSubmissions')) {
          const store = db.createObjectStore('pendingFishSubmissions', { keyPath: 'localId' })
          store.createIndex('syncStatus', 'syncStatus')
          store.createIndex('createdAt', 'createdAt')
        }
        if (!db.objectStoreNames.contains('pendingImageUploads')) {
          const store = db.createObjectStore('pendingImageUploads', { keyPath: 'id' })
          store.createIndex('submissionLocalId', 'submissionLocalId')
        }
        if (!db.objectStoreNames.contains('pendingStatusUpdates')) {
          db.createObjectStore('pendingStatusUpdates', { keyPath: 'localId' })
        }
        if (!db.objectStoreNames.contains('pendingCollectionUpdates')) {
          db.createObjectStore('pendingCollectionUpdates', { keyPath: 'localId' })
        }
        if (!db.objectStoreNames.contains('cachedReferenceLookups')) {
          db.createObjectStore('cachedReferenceLookups', { keyPath: 'referenceNumber' })
        }
        if (!db.objectStoreNames.contains('syncMetadata')) {
          db.createObjectStore('syncMetadata', { keyPath: 'key' })
        }
        if (!db.objectStoreNames.contains('imageBlobs')) {
          const store = db.createObjectStore('imageBlobs', { keyPath: 'id' })
          store.createIndex('submissionLocalId', 'submissionLocalId')
        }
        if (!db.objectStoreNames.contains('cachedFarmers')) {
          db.createObjectStore('cachedFarmers', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('cachedSubmissions')) {
          db.createObjectStore('cachedSubmissions', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('cachedCollections')) {
          db.createObjectStore('cachedCollections', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('cachedPricingRules')) {
          db.createObjectStore('cachedPricingRules', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('cachedTracking')) {
          db.createObjectStore('cachedTracking', { keyPath: 'referenceNumber' })
        }
      },
    })
  }
  return dbPromise
}

export async function savePendingSubmission(data: Record<string, unknown>): Promise<string> {
  const db = await getDb()
  const localId = data.localId as string
  await db.put('pendingFishSubmissions', { ...data, syncStatus: 'pending', updatedAt: Date.now() })
  return localId
}

export async function getPendingSubmissions(): Promise<Record<string, unknown>[]> {
  const db = await getDb()
  return db.getAllFromIndex('pendingFishSubmissions', 'syncStatus', 'pending')
}

export async function getAllPendingSubmissions(): Promise<Record<string, unknown>[]> {
  const db = await getDb()
  return db.getAll('pendingFishSubmissions')
}

export async function updatePendingSubmissionStatus(localId: string, updates: Partial<Record<string, unknown>>) {
  const db = await getDb()
  const existing = await db.get('pendingFishSubmissions', localId)
  if (existing) {
    await db.put('pendingFishSubmissions', { ...existing, ...updates, updatedAt: Date.now() })
  }
}

export async function removePendingSubmission(localId: string) {
  const db = await getDb()
  await db.delete('pendingFishSubmissions', localId)
}

export async function saveImageBlob(id: string, submissionLocalId: string, blob: Blob, fileName: string, category: string) {
  const db = await getDb()
  await db.put('imageBlobs', { id, submissionLocalId, blob, fileName, category, createdAt: Date.now() })
}

export async function getImageBlobs(submissionLocalId: string): Promise<{ id: string; blob: Blob; fileName: string; category: string }[]> {
  const db = await getDb()
  const results = await db.getAllFromIndex('imageBlobs', 'submissionLocalId', submissionLocalId)
  return results.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    blob: r.blob as Blob,
    fileName: r.fileName as string,
    category: r.category as string,
  }))
}

export async function removeImageBlobs(submissionLocalId: string) {
  const db = await getDb()
  const results = await db.getAllFromIndex('imageBlobs', 'submissionLocalId', submissionLocalId)
  for (const r of results) {
    await db.delete('imageBlobs', r.id as string)
  }
}

export async function saveSyncMetadata(key: string, value: Record<string, unknown>) {
  const db = await getDb()
  await db.put('syncMetadata', { key, ...value, updatedAt: Date.now() })
}

export async function getSyncMetadata(key: string): Promise<Record<string, unknown> | undefined> {
  const db = await getDb()
  return db.get('syncMetadata', key)
}

export async function getAllImagesForSync(): Promise<{ id: string; submissionLocalId: string; blob: Blob; fileName: string; category: string }[]> {
  const db = await getDb()
  return db.getAll('imageBlobs') as Promise<{ id: string; submissionLocalId: string; blob: Blob; fileName: string; category: string }[]>
}

export async function getImageBlob(id: string): Promise<{ blob: Blob; fileName: string; category: string; submissionLocalId: string } | undefined> {
  const db = await getDb()
  const result = await db.get('imageBlobs', id) as Record<string, unknown> | undefined
  if (!result) return undefined
  return {
    blob: result.blob as Blob,
    fileName: result.fileName as string,
    category: result.category as string,
    submissionLocalId: result.submissionLocalId as string,
  }
}

export async function cacheRecord(store: string, record: Record<string, unknown>) {
  const db = await getDb()
  if (db.objectStoreNames.contains(store)) {
    await db.put(store, record)
  }
}

export async function getCachedRecord(store: string, id: string) {
  const db = await getDb()
  if (db.objectStoreNames.contains(store)) {
    return db.get(store, id)
  }
  return undefined
}

export async function getAllCachedRecords(store: string) {
  const db = await getDb()
  if (db.objectStoreNames.contains(store)) {
    return db.getAll(store)
  }
  return []
}

export async function clearSyncData() {
  const db = await getDb()
  db.clear('pendingFishSubmissions')
  db.clear('pendingImageUploads')
  db.clear('pendingStatusUpdates')
  db.clear('pendingCollectionUpdates')
  db.clear('imageBlobs')
  db.clear('syncMetadata')
}

export async function getPendingCount(): Promise<number> {
  const db = await getDb()
  const all = await db.getAll('pendingFishSubmissions')
  return all.filter((r: Record<string, unknown>) => r.syncStatus === 'pending' || r.syncStatus === 'failed').length
}

export { getDb }
