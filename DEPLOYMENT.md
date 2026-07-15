# Deployment Guide

## Prerequisites

- Node.js 18+
- Firebase project
- Vercel account (or alternative static hosting)

## Environment Variables

Copy `.env.example` to `.env` and fill in values for both local development and production.

## Vercel Deployment

1. Push the repository to GitHub
2. Import the project in Vercel
3. Set Framework Preset to **Vite**
4. Add all `VITE_*` environment variables
5. Deploy

The `vercel.json` file handles SPA rewrites for all routes.

## Firebase Deployment

```bash
# Login
npx firebase login

# Initialize (one time)
npx firebase init

# Deploy rules
npx firebase deploy --only firestore:rules,firestore:indexes,storage:rules

# Deploy functions (if added)
npx firebase deploy --only functions
```

## Custom Domain

1. Add domain in Vercel project settings
2. Configure DNS as instructed by Vercel
3. Update `VITE_APP_BASE_URL` environment variable

## Production Checklist

- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore indexes deployed
- [ ] Firestore and Storage rules deployed
- [ ] Initial admin user created
- [ ] Demo data seeded (optional)
- [ ] PWA manifest icons generated
- [ ] Lighthouse audit passes for PWA criteria
- [ ] SPA deep links work (test via hard refresh on nested routes)
- [ ] Offline form submission works
