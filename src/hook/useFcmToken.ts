"use client";

import { getToken } from "firebase/messaging";
import { envConfig } from "@/config/envConfig";
import { getMessagingInstance } from "@/lib/firebase/firebase";

/**
 * Get FCM token for this browser.
 * Returns empty string if permission denied or not supported.
 */
export const getFcmToken = async (): Promise<string> => {
  try {
    // Check browser support
    if (typeof window === "undefined") return "";
    if (!("Notification" in window)) return "";
    if (!("serviceWorker" in navigator)) return "";

    // Request permission if needed
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission !== "granted") {
      return "";
    }

    // Get messaging instance
    const messaging = await getMessagingInstance();
    if (!messaging) return "";

    // Register service worker (if not already registered)
    const registration = await navigator.serviceWorker.getRegistration("/");
    if (!registration) {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/",
      });
    }

    // Wait for service worker to be ready
    const swRegistration = await navigator.serviceWorker.ready;

    // Get token - this is the correct non-deprecated signature
    const token = await getToken(messaging, {
      vapidKey: envConfig.firebase.vapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    return token || "";
  } catch (err) {
    console.error("FCM token error:", err);
    return "";
  }
};
