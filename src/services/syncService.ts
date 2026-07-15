import {
  savePendingSubmission, getPendingSubmissions, updatePendingSubmissionStatus,
  removePendingSubmission, getImageBlobs, removeImageBlobs, saveSyncMetadata,
  getSyncMetadata, getPendingCount, getAllImagesForSync,
} from '@/offline/db'
import { useAppStore } from '@/stores/appStore'
import { generateIdempotencyKey, generateLocalId } from '@/lib/idGenerator'
import { db, storage } from '@/config/firebase'
import { collection, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import type { SyncQueueItem, SyncStatus } from '@/types'

let isSyncing = false

async function getNextSequence(): Promise<number> {
  const counterRef = doc(db, 'counters', 'fishSubmissions')
  try {
    const result = await runTransaction(db, async (transaction) => {
      const counter = await transaction.get(counterRef)
      let nextSeq = 1
      if (counter.exists()) {
        nextSeq = (counter.data().currentValue || 0) + 1
      }
      transaction.set(counterRef, { currentValue: nextSeq }, { merge: true })
      return nextSeq
    })
    return result
  } catch {
    const now = Date.now()
    return parseInt(String(now).slice(-4), 10) + Math.floor(Math.random() * 100)
  }
}

export async function syncNow(): Promise<{ synced: number; failed: number }> {
  if (isSyncing) return { synced: 0, failed: 0 }
  isSyncing = true
  useAppStore.getState().setSyncing(true)

  let synced = 0
  let failed = 0

  try {
    const pending = await getPendingSubmissions()
    for (const submission of pending) {
      const localId = submission.localId as string
      await updatePendingSubmissionStatus(localId, { syncStatus: 'syncing' })

      try {
        const imageBlobs = await getImageBlobs(localId)
        const imageUrls: string[] = []

        for (const img of imageBlobs) {
          const storagePath = `submissions/${localId}/${img.fileName}`
          const storageRef = ref(storage, storagePath)
          const uploadTask = uploadBytesResumable(storageRef, img.blob)
          await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed', null, reject, async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref)
                imageUrls.push(url)
                resolve()
              } catch (e) {
                reject(e)
              }
            })
          })
        }

        const sequence = await getNextSequence()
        const year = new Date().getFullYear()
        const referenceNumber = `AGR-FISH-${year}-${String(sequence).padStart(4, '0')}`

        const { syncStatus, ...submissionData } = submission as Record<string, unknown>

        const data = {
          ...submissionData,
          referenceNumber,
          imageUrls,
          syncedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          localId,
          images: imageBlobs.map((b, i) => ({
            id: b.id,
            category: b.category,
            fileName: b.fileName,
            storageUrl: imageUrls[i] || '',
          })),
          idempotencyKey: submission.idempotencyKey || generateIdempotencyKey(),
          status: 'New',
          statusHistory: [{
            status: 'New',
            timestamp: Date.now(),
            comment: 'Submission received',
          }],
        }

        await addDoc(collection(db, 'fishSubmissions'), data)
        await removeImageBlobs(localId)
        await removePendingSubmission(localId)
        synced++

        await saveSyncMetadata('lastSyncTime', { lastSyncTime: Date.now() })
      } catch (err) {
        await updatePendingSubmissionStatus(localId, {
          syncStatus: 'failed',
          retryCount: ((submission.retryCount as number) || 0) + 1,
          lastError: err instanceof Error ? err.message : 'Unknown error',
        })
        failed++
      }
    }

    await updatePendingCount()
  } finally {
    isSyncing = false
    useAppStore.getState().setSyncing(false)
    await saveSyncMetadata('lastSyncTime', { lastSyncTime: Date.now() })
  }

  return { synced, failed }
}

export async function updatePendingCount() {
  const count = await getPendingCount()
  useAppStore.getState().setPendingSyncCount(count)
}

export function setupOnlineSync() {
  const handleOnline = () => {
    useAppStore.getState().setOnline(true)
    syncNow()
  }

  const handleOffline = () => {
    useAppStore.getState().setOnline(false)
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

export async function retryFailedSubmission(localId: string) {
  await updatePendingSubmissionStatus(localId, { syncStatus: 'pending', retryCount: 0, lastError: null })
  await syncNow()
}

export { generateIdempotencyKey, generateLocalId }
