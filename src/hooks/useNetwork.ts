"use client";

import { useEffect, useSyncExternalStore } from "react";
import { chrome } from "@/content/final";
import { toast } from "@/store/experience";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

export function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

/** Offline / back-online notices (Security.md §7). Mount once. */
export function useNetworkNotices() {
  useEffect(() => {
    const off = () => toast(chrome.offline, { duration: 5000 });
    const on = () => toast(chrome.online);
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    return () => {
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
    };
  }, []);
}
