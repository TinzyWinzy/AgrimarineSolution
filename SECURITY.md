# Security

## Authentication

- Firebase Authentication with Email/Password
- Staff and administrator accounts only
- Public visitors do not require accounts to submit forms

## Authorization

- Custom claims or user-role documents in Firestore
- Staff role grants access to operational features
- Administrator role grants access to settings and user management
- Role-based guards on routes and API operations
- Client-supplied roles are never trusted

## Firestore Security Rules

- Public can create submissions but never read others' data
- Staff can read and write operational collections
- Only administrators can manage users and settings
- Public read access for products and pricing rules
- Validated submission shape on create

## Storage Security Rules

- Public can upload images to submissions/ path
- Max file size: 20 MB
- Allowed MIME types: image/*
- Authenticated users can delete their uploads

## Data Protection

- Never expose Firebase Admin keys in client code
- Never log authentication tokens
- Strip image metadata where practical
- Use HTTPS in production
- Environment variables for all secrets

## Creating the Initial Administrator

1. Create user in Firebase Console > Authentication
2. Create a Firestore document in `users` collection with the user's UID
3. Set `role: "administrator"` and `active: true`
4. Sign in with the created credentials
