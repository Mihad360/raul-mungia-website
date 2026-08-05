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
        await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
          scope: "/",
        });
        await navigator.serviceWorker.ready;

        const messaging = await getMessagingInstance();
        if (!messaging) return;

        unsubscribe = onMessage(messaging, (payload) => {
          console.log("Foreground FCM message:", payload);

          const title = payload.notification?.title || "New notification";
          const body = payload.notification?.body || "";
          const orderId = payload.data?.orderId as string | undefined;

          // ─── 1. Sonner toast at bottom-right (won't collide with top-center) ───
          toast(title, {
            description: body,
            duration: 5000,
            position: "top-center",
          });

          // ─── 2. Native browser/OS notification ───
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const notification = new Notification(title, {
              body,
              icon: "/notification-icon.svg",
              badge: "/notification-icon.svg",
              tag: orderId || "notification",
            });

            notification.onclick = () => {
              window.focus();
              if (orderId) {
                window.location.href = `/orders/${orderId}`;
              }
              notification.close();
            };
          }
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
