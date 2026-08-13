import envConfig from "@/config/envConfig";

// Always resolve env at request time (LOCAL vs LIVE via envConfig)
export const dynamic = "force-dynamic";

/**
 * Dynamic Firebase messaging service worker.
 * Static files in /public cannot read Next.js env, so this route injects
 * the same LOCAL/LIVE Firebase config used by the client app.
 */
export function GET() {
  const {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  } = envConfig.firebase;

  const missing = [
    ["apiKey", apiKey],
    ["authDomain", authDomain],
    ["projectId", projectId],
    ["storageBucket", storageBucket],
    ["messagingSenderId", messagingSenderId],
    ["appId", appId],
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    const keys = missing.map(([key]) => key).join(", ");
    const body = `console.error("[firebase-messaging-sw] Missing Firebase env: ${keys}");`;
    return new Response(body, {
      status: 500,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  const body = `/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js",
);

firebase.initializeApp(${JSON.stringify(firebaseConfig)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/notification-icon.svg",
    badge: "/notification-icon.svg",
    tag: payload.data?.orderId || "notification",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const orderId = event.notification.data?.orderId;
  const urlToOpen = orderId ? "/orders/" + orderId : "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      }),
  );
});
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      // Avoid sticky SW with stale Firebase project after deploy
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
