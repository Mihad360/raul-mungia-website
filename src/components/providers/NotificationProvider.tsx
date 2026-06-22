"use client";

import { useEffect } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { toast } from "sonner";
import { getMessagingInstance } from "@/lib/firebase/firebase";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const setupListener = async () => {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator)) return;

      try {
        // Register the SW eagerly (doesn't require permission — only getToken does)
        await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
          scope: "/",
        });

        // Wait for it to become active
        await navigator.serviceWorker.ready;

        // Now set up the foreground message listener
        const messaging = await getMessagingInstance();
        if (!messaging) return;

        unsubscribe = onMessage(messaging, (payload) => {
          console.log("Foreground FCM message:", payload);
          toast(payload.notification?.title || "New notification", {
            description: payload.notification?.body || "",
            duration: 5000,
          });
        });
      } catch (err) {
        console.error("FCM listener setup failed:", err);
      }
    };

    setupListener();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
