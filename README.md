# Agrimarine Farmer & Operations Platform

A Progressive Web Application for Agrimarine Solutions — a Zimbabwean aquaculture company providing pond design, dam liners, Nile tilapia fingerlings, fish feed, fish buy-back, and refrigerated collection services.

## Technology Stack

- **Vite** — Build tool
- **React 19** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling
- **React Router** — Client-side routing with code splitting
- **Firebase** — Authentication, Firestore, Storage
- **Zustand** — Global state
- **TanStack Query** — Server state (optional)
- **React Hook Form + Zod** — Form validation
- **Lucide React** — Icons
- **date-fns** — Date utilities
- **Leaflet** — Maps (OpenStreetMap, no API key required)
- **vite-plugin-pwa** — PWA support with Workbox
- **idb** — IndexedDB wrapper for offline persistence

## Local Installation

```bash
# Clone and install
cd aquamarinesolutions
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

## Required Environment Variables

See `.env.example` for all variables. At minimum:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |

## Firebase Project Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Cloud Firestore database
4. Enable Storage
5. Register a web app and copy config to `.env`
6. Deploy Firestore and Storage rules:

```bash
npx firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

## Creating the First Administrator

1. Create a user in Firebase Console > Authentication
2. Create a document in the `users` collection with the user's UID:
```json
{
  "email": "admin@agrimarine.co.zw",
  "displayName": "Administrator",
  "role": "administrator",
  "active": true
}
```

## Seeding Demo Data

Use the Firebase Console to create demo records, or run the seed script with Admin SDK:

```bash
npx tsx scripts/seed-demo-data.ts
```

Key demo farmers:
- **Tawanda Moyo** — Moyo Aqua Farm, Marondera, 420 kg Nile tilapia, USD 1,470
- **Rutendo Fisheries** — Murehwa, 680 kg, collection scheduled

## Running Tests

```bash
# Unit tests
npx vitest run

# With UI
npx vitest --ui

# E2E tests (requires Playwright)
npx playwright test
```

## Building for Production

```bash
npm run build
# Output in dist/
```

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or connect the GitHub repo to Vercel for auto-deploy
```

Set all `VITE_*` environment variables in Vercel project settings.

## Deploying Firebase Rules

```bash
npx firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

## PWA Installation

When visiting the site on a supported browser, an install prompt will appear. Users can also:
- Chrome: Add to Home Screen
- Safari: Share > Add to Home Screen
- The app works offline once installed

## Offline Behavior

- The app shell and static assets are cached by the service worker
- Fish submissions can be completed offline with images stored in IndexedDB
- Pending submissions sync automatically when connectivity returns
- Staff can view cached records and queue updates offline
- See `OFFLINE_SYNC.md` for detailed architecture

## Resetting Demo Data

In the admin panel, navigate to Settings > Demo to reset demonstration data.
Or use the Firebase Console to delete documents with `isDemo: true`.

## Custom Domain

Update the A record or CNAME to point to Vercel's nameservers.
Set the domain in Vercel project settings > Domains.

## Known Limitations

- Map tiles require internet (cached tiles work offline for previously viewed areas)
- Background Sync API has limited browser support; manual retry fallback is used
- Cloud Functions require Node.js 18+ deployment
- Email/SMS notification adapters require additional configuration
- Full Playwright E2E tests require browser installation and Firebase emulator
