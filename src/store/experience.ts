import { create } from "zustand";

export type Tier = "high" | "mid" | "low" | "none";
export type LoaderState = "loading" | "exiting" | "done";
export type SceneId = "identity" | "toolkit" | "create" | "projects" | "philosophy" | "final";

export interface ToastItem {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss; 0 keeps it until dismissed. */
  duration?: number;
}

interface ExperienceState {
  loaderState: LoaderState;
  tier: Tier;
  /** True once the FPS monitor has stepped down — it never flips back (Design.md §11). */
  tierStepped: boolean;
  /** WebGL context lost → 3D scenes switch to their DOM fallbacks without reload. */
  webglLost: boolean;
  /** The 3D HASI letters are on screen — the DOM letters can step back. */
  lettersReady: boolean;
  /** Scenes actually rendered, in order (projects disappear while the list is empty). */
  scenes: SceneId[];
  activeScene: SceneId;
  hoveredTool: string | null;
  contactOpen: boolean;
  toasts: ToastItem[];

  setLoaderState: (s: LoaderState) => void;
  setTier: (t: Tier) => void;
  stepDownTier: () => void;
  setWebglLost: (lost: boolean) => void;
  setLettersReady: (ready: boolean) => void;
  setScenes: (s: SceneId[]) => void;
  setActiveScene: (s: SceneId) => void;
  setHoveredTool: (id: string | null) => void;
  setContactOpen: (open: boolean) => void;
  pushToast: (t: Omit<ToastItem, "id">) => number;
  dismissToast: (id: number) => void;
}

const order: Tier[] = ["high", "mid", "low", "none"];
let toastId = 0;

export const useExperience = create<ExperienceState>((set, get) => ({
  loaderState: "loading",
  // "none" until detected: server HTML and no-JS visitors get the DOM versions.
  tier: "none",
  tierStepped: false,
  webglLost: false,
  lettersReady: false,
  scenes: [],
  activeScene: "identity",
  hoveredTool: null,
  contactOpen: false,
  toasts: [],

  setLoaderState: (loaderState) => set({ loaderState }),
  setTier: (tier) => set({ tier }),
  stepDownTier: () => {
    const { tier, tierStepped } = get();
    if (tierStepped || tier === "none" || tier === "low") return;
    set({ tier: order[order.indexOf(tier) + 1], tierStepped: true });
  },
  setWebglLost: (webglLost) => set(webglLost ? { webglLost, lettersReady: false } : { webglLost }),
  setLettersReady: (lettersReady) => set({ lettersReady }),
  setScenes: (scenes) => set({ scenes }),
  setActiveScene: (activeScene) => {
    if (get().activeScene !== activeScene) set({ activeScene });
  },
  setHoveredTool: (hoveredTool) => {
    if (get().hoveredTool !== hoveredTool) set({ hoveredTool });
  },
  setContactOpen: (contactOpen) => set({ contactOpen }),
  pushToast: (t) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts.filter((x) => x.message !== t.message), { ...t, id }] });
    return id;
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

/** Imperative helper for non-React code (network listeners, contact fallbacks). */
export const toast = (message: string, opts: Omit<ToastItem, "id" | "message"> = {}) =>
  useExperience.getState().pushToast({ message, ...opts });
