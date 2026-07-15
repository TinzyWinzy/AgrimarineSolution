/**
 * Reset demo data script.
 * Run with: npx tsx scripts/reset-demo-data.ts
 *
 * Deletes all demo records from Firestore.
 * Requires Firebase Admin SDK credentials.
 */

console.log(`
Reset Demo Data
===============
To reset demo data:

1. Set up Firebase Admin SDK credentials
2. Run: npx tsx scripts/reset-demo-data.ts

This will delete all records with isDemo == true
from fishSubmissions, farmers, collections, etc.

Or use the Firebase Console to manually delete documents.
`)
