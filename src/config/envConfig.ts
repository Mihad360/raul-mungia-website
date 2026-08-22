// Next.js automatically loads the correct env file based on NODE_ENV:
//   development → .env.local  (local dev server)
//   production  → env vars must be set on the deployment platform (Vercel dashboard)
//                 Falls back to live URL if env vars are not set.

const isProduction = process.env.NODE_ENV === "production";

const envConfig = {
  NODE_ENV: process.env.NODE_ENV,

  baseApi: isProduction
    ? process.env.NEXT_PUBLIC_LIVE_API_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_URL,

  baseUrl: isProduction
    ? process.env.NEXT_PUBLIC_LIVE_BASE_URL
    : process.env.NEXT_PUBLIC_LOCAL_BASE_URL,

  payment: {
    cashApp: process.env.NEXT_PUBLIC_CASHAPP_HANDLE ?? "$STXResearch1",
    venmo: process.env.NEXT_PUBLIC_VENMO_HANDLE ?? "@STXRESEARCH",
    // Zelle is handle-only (no QR) — same handle as Cash App per client
    zelle: process.env.NEXT_PUBLIC_ZELLE_HANDLE ?? "$STXResearch1",
  },

  firebase: {
    apiKey: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_API_KEY
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_API_KEY,
    authDomain: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_AUTH_DOMAIN
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_AUTH_DOMAIN,
    projectId: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_PROJECT_ID
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_PROJECT_ID,
    storageBucket: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_STORAGE_BUCKET
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_MESSAGING_SENDER_ID
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_MESSAGING_SENDER_ID,
    appId: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_APP_ID
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_APP_ID,
    vapidKey: isProduction
      ? process.env.NEXT_PUBLIC_LIVE_FIREBASE_VAPID_KEY
      : process.env.NEXT_PUBLIC_LOCAL_FIREBASE_VAPID_KEY,
  },
} as const;

export default envConfig;
