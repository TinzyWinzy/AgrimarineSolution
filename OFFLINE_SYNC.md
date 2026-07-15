# Offline Synchronization

## Architecture

The offline system uses IndexedDB as the durable local data layer, wrapped by the `idb` library.

## IndexedDB Schema

Database: `agrimarine-offline` (version 1)

### Object Stores

| Store | Key | Purpose |
|-------|-----|---------|
| pendingFishSubmissions | localId | Queued submission payloads |
| imageBlobs | id | Binary image data linked to submissions |
| pendingImageUploads | id | Image upload metadata |
| pendingStatusUpdates | localId | Staff status change queue |
| pendingCollectionUpdates | localId | Collection update queue |
| cachedReferenceLookups | referenceNumber | Cache of official references |
| cachedFarmers | id | Farmer read cache |
| cachedSubmissions | id | Submission read cache |
| cachedCollections | id | Collection read cache |
| cachedPricingRules | id | Pricing rule cache |
| cachedTracking | referenceNumber | Public tracking cache |
| syncMetadata | key | Sync timing/stats |

## Queue Model

Each queued operation contains:
- `localId` — Unique client-generated ID
- `operationType` — Type of operation
- `payload` — Full operation data
- `idempotencyKey` — Deterministic key for deduplication
- `createdAt`, `updatedAt` — Timestamps
- `retryCount` — Incremented on failure
- `syncStatus` — pending | syncing | synced | failed | requiresAttention

## Sync Flow

1. Triggered by: online event, app start, manual Sync Now, periodic interval (30s)
2. Load all `pending` items ordered by `createdAt`
3. For each item:
   a. Mark `syncing`
   b. Upload associated images first
   c. Execute the operation (create/update Firestore document)
   d. On success: remove local item, update counter
   e. On failure: increment retry, mark `failed`, preserve for manual retry
4. Update pending count in UI

## Idempotency

- Each submission generates a unique `idempotencyKey` before any network operation
- On retry, the sync service checks if the document already exists
- Image uploads generate safe filenames to prevent duplicates

## Conflict Detection

- Staff updates include `version` field
- Before applying an update, compare local `version` with server `version`
- If server version > local version, mark as `requiresAttention`
- Admin can view both versions and resolve

## Browser Support

- IndexedDB: supported in all modern browsers
- Background Sync API: Chromium-based browsers only
- Fallback: Manual retry button + online event listener
