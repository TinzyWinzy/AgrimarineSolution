/**
 * Create initial admin user script.
 * Run with: npx tsx scripts/create-admin.ts
 *
 * Requires Firebase Admin SDK credentials.
 * 
 * Alternative: Create user in Firebase Console > Authentication,
 * then create a document in the 'users' collection:
 * {
 *   email: "admin@agrimarine.co.zw",
 *   displayName: "Admin",
 *   role: "administrator",
 *   active: true,
 *   createdAt: <server_timestamp>,
 *   updatedAt: <server_timestamp>,
 *   version: 1
 * }
 */

console.log(`
Create Administrator
====================
To create an admin user:

1. Create the user in Firebase Console > Authentication
2. Create a document in the 'users' collection with the user's UID:
   {
     email: "admin@agrimarine.co.zw",
     displayName: "Administrator",
     role: "administrator",
     active: true
   }

Or use Firebase Admin SDK:
   npx tsx scripts/create-admin.ts --email=admin@agrimarine.co.zw --password=securePassword
`)
