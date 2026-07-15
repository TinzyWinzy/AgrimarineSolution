export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Agrimarine Solutions',
  baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173',
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+263778840934',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  },
}

export function validateEnv() {
  const missing: string[] = []
  if (!env.firebase.apiKey) missing.push('VITE_FIREBASE_API_KEY')
  if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) missing.push('VITE_FIREBASE_AUTH_DOMAIN')
  if (!env.firebase.projectId) missing.push('VITE_FIREBASE_PROJECT_ID')
  return missing
}
