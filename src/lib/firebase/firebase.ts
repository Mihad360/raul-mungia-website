import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, isSupported } from "firebase/messaging";
import { envConfig } from "@/config/envConfig";

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(envConfig.firebase) : getApps()[0];

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;

  try {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
  } catch (err) {
    console.error("Firebase messaging not supported:", err);
    return null;
  }
};

export default app;
