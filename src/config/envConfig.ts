// Next.js automatically loads the correct env file based on NODE_ENV:
//   development → .env.local  (local dev server)
//   production  → env vars must be set on the deployment platform (Vercel dashboard)
//                 Falls back to live URL if env vars are not set.

const isProduction = process.env.NODE_ENV === "production";

const envConfig = {
  NODE_ENV: process.env.NODE_ENV,

  baseApi: isProduction
    ? (process.env.NEXT_PUBLIC_LIVE_API_URL ?? "https://api.stxresearch.com/api/v1")
    : (process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "https://mihad8080.merinasib.shop/api/v1"),

  baseUrl: isProduction
    ? (process.env.NEXT_PUBLIC_LIVE_BASE_URL ?? "https://api.stxresearch.com")
    : (process.env.NEXT_PUBLIC_LOCAL_BASE_URL ?? "https://mihad8080.merinasib.shop"),

  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  },
} as const;

export default envConfig;