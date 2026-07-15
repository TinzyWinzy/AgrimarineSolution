# Architecture

## Overview

Agrimarine is a client-side single-page application (SPA) built with Vite + React + TypeScript.
It uses Firebase as the backend (Authentication, Firestore, Storage) and IndexedDB for offline persistence.

## Key Design Decisions

1. **SPA with code splitting** — Each route group is lazy-loaded. No SSR. Deployed to Vercel with SPA rewrites.
2. **Firebase as BaaS** — Authentication, database, and file storage handled by Firebase. No custom server.
3. **Offline-first with IndexedDB** — The `idb` library provides a Promise-based IndexedDB wrapper. All critical workflows work offline.
4. **Optimistic concurrency** — For staff offline updates, `updatedAt` and `version` fields prevent silent overwrites.
5. **Pricing rules** — Configurable per-species pricing cached for offline calculation.

## Directory Structure

```
src/
  app/            # App-wide configuration
  assets/         # Static assets (images)
  components/     # Reusable UI components
  config/         # Firebase and env config
  features/       # Feature modules (auth, farmers, sync, etc.)
  hooks/          # Custom React hooks
  layouts/        # Public and app layout shells
  lib/            # Utility functions
  offline/        # IndexedDB operations
  pages/          # Route page components
  repositories/   # Data access layer
  routes/         # Router configuration
  schemas/        # Zod validation schemas
  services/       # Business logic services
  stores/         # Zustand state stores
  types/          # TypeScript type definitions
  utils/          # Helper functions
firebase/         # Firebase rules and indexes
scripts/          # Utility scripts
tests/            # Unit, integration, and E2E tests
```

## Data Flow

1. **Online submission**: Form → Validation → Image compression → Firebase Storage upload → Firestore document create → Success page
2. **Offline submission**: Form → Validation → Image Blob storage in IndexedDB → Save submission payload in IndexedDB → Local reference → Sync queue
3. **Sync**: Online event → Load pending → Upload images → Get sequence → Create Firestore document → Remove local → Update UI
4. **Staff updates**: Action → Optimistic UI update → If online: Firestore update → If offline: Queue update → Sync later
