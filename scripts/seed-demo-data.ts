/**
 * Demo data seed script.
 * Run with: npx tsx scripts/seed-demo-data.ts
 *
 * Populates Firestore with fictional demonstration data.
 * Requires Firebase Admin SDK credentials.
 */

// Placeholder - actual implementation requires Firebase Admin SDK setup
console.log(`
Demo Data Seed Script
=====================
To seed demo data:

1. Set up Firebase Admin SDK credentials
2. Run: npx tsx scripts/seed-demo-data.ts

This will create:
- 42 farmers across Zimbabwe
- 18 fish submissions
- 12 collections
- 12 service enquiries
- 10 supply requests
- 7 training bookings
- 4 staff profiles
- 3 pricing rules
- 12 products
- 25 activity records
- 15 notifications

Key demo farmers:
  - Tawanda Moyo (Moyo Aqua Farm, Marondera, 420kg Nile tilapia)
  - Rutendo Fisheries (Murehwa, 680kg, collection scheduled)

Without Admin SDK, use the Firebase Console or Firestore Emulator UI
to create records manually, or sign up at /app/demo to use the app.
`)
