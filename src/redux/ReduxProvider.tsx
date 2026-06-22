"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import NotificationProvider from "@/components/providers/NotificationProvider";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider>{children}</NotificationProvider>
    </Provider>
  );
}
