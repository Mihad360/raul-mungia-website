// Next.js sets NODE_ENV automatically:
//   npm run dev   → development → LOCAL_* vars
//   npm run build → production  → LIVE_* vars
// Keep both LOCAL and LIVE keys in .env.local (or the host dashboard).
// This file is the only switch — website and admin dashboard share it.

const isProduction = process.env.NODE_ENV === "production";

const pick = (live?: string, local?: string) =>
  isProduction ? live || local : local || live;

const envConfig = {
  NODE_ENV: process.env.NODE_ENV,

  baseApi: pick(
    process.env.NEXT_PUBLIC_LIVE_API_URL,
    process.env.NEXT_PUBLIC_LOCAL_API_URL,
  ),

  baseUrl: pick(
    process.env.NEXT_PUBLIC_LIVE_BASE_URL,
    process.env.NEXT_PUBLIC_LOCAL_BASE_URL,
  ),

  payment: {
    cashApp: process.env.NEXT_PUBLIC_CASHAPP_HANDLE ?? "$STXResearch1",
    venmo: process.env.NEXT_PUBLIC_VENMO_HANDLE ?? "@STXRESEARCH",
    // Zelle is handle-only (no QR) — same handle as Cash App per client
    zelle:
      process.env.NEXT_PUBLIC_ZELLE_HANDLE ??
      process.env.NEXT_PUBLIC_ZELLE_PHONE ??
      "$STXResearch1",
  },

  firebase: {
    apiKey: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_API_KEY,
    ),
    authDomain: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_AUTH_DOMAIN,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_AUTH_DOMAIN,
    ),
    projectId: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_PROJECT_ID,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_PROJECT_ID,
    ),
    storageBucket: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_STORAGE_BUCKET,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_STORAGE_BUCKET,
    ),
    messagingSenderId: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_MESSAGING_SENDER_ID,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_MESSAGING_SENDER_ID,
    ),
    appId: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_APP_ID,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_APP_ID,
    ),
    vapidKey: pick(
      process.env.NEXT_PUBLIC_LIVE_FIREBASE_VAPID_KEY,
      process.env.NEXT_PUBLIC_LOCAL_FIREBASE_VAPID_KEY,
    ),
  },
} as const;

export default envConfig;
