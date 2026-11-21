/**
 * The director turns one scroll position into the whole film.
 *
 * - A tall scroll track (#scroll-track) sits behind a fixed stage. Its height is the sum of
 *   every scene and transition length (in viewport heights).
 * - One GSAP master timeline, scrubbed by ScrollTrigger, holds every scene's own timeline at
 *   its offset. Scrubbing makes everything reversible for free (Rules.md §3.4).
 * - On every update the director derives: each scene's local progress, the active
 *   transition (RED CUT clip-paths or depth push), which scene layers are visible/inert,
 *   the active scene for the chrome, and the state the 3D canvas reads each frame.
 */
import type { SceneId } from "@/store/experience";
import { useExperience } from "@/store/experience";
import { getGsap } from "./gsap";
import { getLenis, scrollToY, startLenis } from "./lenis";
import { clamp, easeInOutCubic } from "./utils";
import { hasFinePointer } from "./a11y";

export type TransitionKind = "redcut" | "depth";

/** Lengths in viewport heights (Design.md §9). `enter` = how the scene arrives. */
export const SCENE_DEFS: Record<
  SceneId,
  { length: number; lengthMobile?: number; enter: TransitionKind | null }
> = {
  identity: { length: 2.2, enter: null },
  toolkit: { length: 3.2, enter: "redcut" },
  create: { length: 6.6, lengthMobile: 6.0, enter: "depth" },
  projects: { length: 2.8, enter: "redcut" },
  philosophy: { length: 3.0, enter: "depth" },
  final: { length: 2.0, enter: "redcut" },
};

const TRANSITION_LENGTH: Record<TransitionKind, number> = { redcut: 0.4, depth: 0.5 };
const SHORT_SCALE = 0.7; // landscape phones (height < 500): pins × 0.7 (Design.md §13)
const RED_CUT_ANGLE = (18 * Math.PI) / 180;
const SCROLL_KEY = "hasi-scroll";

export interface BuildContext {
  vw: number;
  vh: number;
  /** < 640 px wide, or portrait tablets: vertical chapters, 2.5D toolkit. */
  mobile: boolean;
  /** height < 500 px */
  short: boolean;
  touch: boolean;
}

type Builder = (tl: gsap.core.Timeline, ctx: BuildContext) => void;
interface Registration {
  build: Builder;
  /** Local scene fractions to snap to on touch (Scene 03 chapters). */
  snap?: (ctx: BuildContext) => number[];
}

interface Segment {
  kind: "scene" | TransitionKind;
  scene: SceneId; // for transitions: the scene that enters
  from?: SceneId;
  start: number;
  length: number;
}

export interface TransitionState {
  kind: TransitionKind;
  from: SceneId;
  to: SceneId;
  /** 0 → 1 across the transition. */
  p: number;
}

type Listener = () => void;

const registry = new Map<SceneId, Registration>();
const listeners = new Set<Listener>();

export const director = {
  ready: false,
  /** Master time in viewport heights. */
  time: 0,
  total: 1,
  segments: [] as Segment[],
  /** Local 0–1 progress for every scene (clamped). */
  progress: {} as Record<SceneId, number>,
  transition: null as TransitionState | null,
  /** 0–1 across the whole page (scene index / progress bar). */
  pageProgress: 0,
  ctx: null as BuildContext | null,
};

let master: gsap.core.Timeline | null = null;
let trigger: ScrollTrigger | null = null;
let gctx: gsap.Context | null = null;
let buildQueued = false;
let lastWidth = 0;
let lastHeight = 0;
let resizeTimer = 0;
let saveTimer = 0;
let restored = false;
const applied = new Map<string, string>();

/* ─────────────── Registration ─────────────── */

export function registerScene(id: SceneId, reg: Registration) {
  registry.set(id, reg);
  queueBuild();
  return () => {
    if (registry.get(id) === reg) registry.delete(id);
    queueBuild();
  };
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/* ─────────────── Measuring ─────────────── */

function measureVh() {
  // 100svh is stable while mobile toolbars slide; a probe element reads it in px.
  const probe = document.getElementById("svh-probe");
  return probe?.getBoundingClientRect().height || window.innerHeight;
}

function buildContext(): BuildContext {
  const vw = document.documentElement.clientWidth;
  const vh = measureVh();
  const touch = !hasFinePointer();
  const portrait = vh > vw;
  return {
    vw,
    vh,
    mobile: vw < 640 || (vw < 1024 && portrait),
    short: window.innerHeight < 500,
    touch,
  };
}

function sceneLength(id: SceneId, ctx: BuildContext) {
  const def = SCENE_DEFS[id];
  const base = ctx.mobile && def.lengthMobile ? def.lengthMobile : def.length;
  return base * (ctx.short ? SHORT_SCALE : 1);
}

function layoutSegments(order: SceneId[], ctx: BuildContext) {
  const segments: Segment[] = [];
  let t = 0;
  order.forEach((id, i) => {
    const enter = SCENE_DEFS[id].enter;
    if (i > 0 && enter) {
      const length = TRANSITION_LENGTH[enter] * (ctx.short ? SHORT_SCALE : 1);
      segments.push({ kind: enter, scene: id, from: order[i - 1], start: t, length });
      t += length;
    }
    const length = sceneLength(id, ctx);
    segments.push({ kind: "scene", scene: id, start: t, length });
    t += length;
  });
  return { segments, total: t };
}

/* ─────────────── Build ─────────────── */

function queueBuild() {
  if (buildQueued || typeof window === "undefined") return;
  buildQueued = true;
  requestAnimationFrame(() => {
    buildQueued = false;
    build();
  });
}

function build() {
  if (!document.documentElement.classList.contains("cine")) return;
  const order = useExperience.getState().scenes;
  if (order.length === 0 || order.some((id) => !registry.has(id))) return;

  const { gsap, ScrollTrigger } = getGsap();
  const keepRatio = director.ready ? director.pageProgress : null;

  gctx?.revert();
  trigger = null;
  master = null;
  applied.clear();

  const ctx = buildContext();
  lastWidth = ctx.vw;
  lastHeight = ctx.vh;
  director.ctx = ctx;
  const { segments, total } = layoutSegments(order, ctx);
  director.segments = segments;
  director.total = total;

  const track = document.getElementById("scroll-track");
  if (!track) return;
  track.style.height = `${(total + 1) * ctx.vh}px`;

  gctx = gsap.context(() => {
    master = gsap.timeline({ paused: true, onUpdate: tick });
    for (const seg of segments) {
      if (seg.kind !== "scene") continue;
      const tl = gsap.timeline();
      registry.get(seg.scene)!.build(tl, ctx);
      tl.set({}, {}, 1); // every scene timeline spans exactly 0 → 1 …
      tl.duration(seg.length); // … then is stretched to its scroll length
      master.add(tl, seg.start);
    }
    master.set({}, {}, total);

    snapPoints = ctx.touch ? collectSnapPoints(segments, ctx, total) : [];
    trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      animation: master,
      scrub: ctx.touch ? true : 0.8,
    });
  });

  ScrollTrigger.refresh();
  director.ready = true;

  if (keepRatio !== null) {
    jumpToRatio(keepRatio);
  } else if (!restored) {
    restored = true;
    const saved = readSavedRatio();
    if (saved !== null) jumpToRatio(saved);
  }
  tick();
}

/** Touch: snap only inside scenes that ask for it (Scene 03 chapters); elsewhere, free. */
function collectSnapPoints(segments: Segment[], ctx: BuildContext, total: number) {
  const points: { at: number; from: number; to: number }[] = [];
  for (const seg of segments) {
    if (seg.kind !== "scene") continue;
    const fractions = registry.get(seg.scene)?.snap?.(ctx);
    if (!fractions?.length) continue;
    for (const f of fractions) {
      points.push({
        at: (seg.start + f * seg.length) / total,
        from: seg.start / total,
        to: (seg.start + seg.length) / total,
      });
    }
  }
  return points;
}

/**
 * Touch only: once scrolling has settled inside a snapping scene, ease to the nearest
 * chapter if it is close. Anywhere else the scroll stays exactly where the visitor put it.
 * (ScrollTrigger's own snap projects flick velocity past the page end, so it is not used.)
 */
let snapPoints: { at: number; from: number; to: number }[] = [];
let snapTimer = 0;
let snapping = false;

function onScrollSettle() {
  if (!snapPoints.length || snapping) return;
  window.clearTimeout(snapTimer);
  snapTimer = window.setTimeout(() => {
    const range = scrollRange();
    if (!range) return;
    const value = window.scrollY / range;
    const inside = snapPoints.filter((p) => value >= p.from && value <= p.to);
    if (!inside.length) return;
    const target = inside.reduce(
      (best, p) => (Math.abs(p.at - value) < Math.abs(best - value) ? p.at : best),
      inside[0].at,
    );
    const dy = (target - value) * range;
    if (Math.abs(dy) < 2 || Math.abs(dy) > window.innerHeight * 0.6) return;
    snapping = true;
    window.scrollTo({ top: target * range, behavior: "smooth" });
    window.setTimeout(() => (snapping = false), 700);
  }, 160);
}

/* ─────────────── Per-update ─────────────── */

function tick() {
  if (!master) return;
  const t = master.time();
  director.time = t;
  director.pageProgress = clamp(t / director.total);

  let transition: TransitionState | null = null;
  for (const seg of director.segments) {
    if (seg.kind === "scene") {
      director.progress[seg.scene] = clamp((t - seg.start) / seg.length);
    } else if (t >= seg.start && t <= seg.start + seg.length && seg.from) {
      transition = {
        kind: seg.kind,
        from: seg.from,
        to: seg.scene,
        p: clamp((t - seg.start) / seg.length),
      };
    }
  }
  director.transition = transition;

  applyLayers(t, transition);

  const active = activeSceneAt(t, transition);
  useExperience.getState().setActiveScene(active);
  listeners.forEach((fn) => fn());
  scheduleSave();
}

function activeSceneAt(t: number, tr: TransitionState | null): SceneId {
  if (tr) return tr.p < 0.5 ? tr.from : tr.to;
  const seg = director.segments.find(
    (s) => s.kind === "scene" && t >= s.start && t <= s.start + s.length,
  );
  return seg?.scene ?? director.segments[director.segments.length - 1]?.scene ?? "identity";
}

function setStyle(
  el: HTMLElement,
  key: string,
  prop: "clipPath" | "transform" | "opacity" | "visibility",
  value: string,
) {
  const k = `${key}:${prop}`;
  if (applied.get(k) === value) return;
  applied.set(k, value);
  el.style[prop] = value;
}

function layer(id: SceneId) {
  return document.querySelector<HTMLElement>(`[data-scene-layer="${id}"]`);
}

/** Visibility, inertness, RED CUT clips and depth pushes for every scene layer. */
function applyLayers(t: number, tr: TransitionState | null) {
  const ctx = director.ctx!;
  const band = document.getElementById("red-cut");
  const canvasWrap = document.getElementById("stage-canvas");

  for (const seg of director.segments) {
    if (seg.kind !== "scene") continue;
    const el = layer(seg.scene);
    if (!el) continue;
    const inScene = t >= seg.start - 0.001 && t <= seg.start + seg.length + 0.001;
    const inTransition = !!tr && (tr.from === seg.scene || tr.to === seg.scene);
    const visible = inScene || inTransition;
    setStyle(el, seg.scene, "visibility", visible ? "visible" : "hidden");

    const isActive = activeSceneAt(t, tr) === seg.scene;
    if (isActive) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
    el.toggleAttribute("data-active", isActive);

    let clip = "none";
    let transform = "none";
    let opacity = "1";
    if (tr && inTransition) {
      const q = tr.p;
      if (tr.kind === "redcut") {
        const c = redCutGeometry(ctx, q);
        clip = tr.from === seg.scene ? c.outgoing : c.incoming;
      } else {
        const e = easeInOutCubic(q);
        if (tr.from === seg.scene) {
          transform = `scale(${1 + 0.08 * e})`;
          opacity = `${1 - e}`;
        } else {
          transform = `scale(${0.96 + 0.04 * e})`;
          opacity = `${e}`;
        }
      }
    }
    setStyle(el, seg.scene, "clipPath", clip);
    setStyle(el, seg.scene, "transform", transform);
    setStyle(el, seg.scene, "opacity", opacity);
  }

  if (band) {
    if (tr?.kind === "redcut") {
      setStyle(band, "band", "visibility", "visible");
      setStyle(band, "band", "clipPath", redCutGeometry(ctx, tr.p).band);
    } else {
      setStyle(band, "band", "visibility", "hidden");
    }
  }

  // The 3D canvas belongs to Scenes 01–02: it fades with the depth push out of the toolkit.
  if (canvasWrap) {
    const toolkit = director.segments.find((s) => s.kind === "scene" && s.scene === "toolkit");
    let o = 1;
    if (tr?.kind === "depth" && tr.from === "toolkit") o = 1 - easeInOutCubic(tr.p);
    else if (toolkit && t > toolkit.start + toolkit.length) o = 0;
    setStyle(canvasWrap, "canvas", "opacity", `${o}`);
    setStyle(canvasWrap, "canvas", "visibility", o > 0 ? "visible" : "hidden");
  }
}

/**
 * THE RED CUT (Design.md §7): a band rising to the right at 18° sweeps up from the
 * bottom-left corner to the top-right. Its leading edge clips the outgoing scene away; its
 * trailing edge reveals the incoming one. Thickness ≈ 18vw measured across the band.
 */
export function redCutGeometry(ctx: Pick<BuildContext, "vw" | "vh">, p: number) {
  const W = ctx.vw;
  const H = ctx.vh;
  const tan = Math.tan(RED_CUT_ANGLE);
  const thick = Math.min(Math.max(W * 0.18, 140), 420) / Math.cos(RED_CUT_ANGLE);
  const c0 = H + tan * W; // leading edge fully below the bottom-right corner
  const c1 = -thick; // trailing edge fully above the top-left corner
  const e = easeInOutCubic(p);
  const c = c0 + (c1 - c0) * e;
  const yL = (x: number, off = 0) => `${(c + off - tan * x).toFixed(1)}px`;
  return {
    outgoing: `polygon(0px 0px, ${W}px 0px, ${W}px ${yL(W)}, 0px ${yL(0)})`,
    incoming: `polygon(0px ${yL(0, thick)}, ${W}px ${yL(W, thick)}, ${W}px ${H}px, 0px ${H}px)`,
    band: `polygon(0px ${yL(0)}, ${W}px ${yL(W)}, ${W}px ${yL(W, thick)}, 0px ${yL(0, thick)})`,
    /** Screen-space lines (px) for the 3D clipping planes: y = c − tan·x. */
    lead: c,
    trail: c + thick,
    tan,
  };
}

/* ─────────────── Navigation ─────────────── */

function scrollRange() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function ratioToY(ratio: number) {
  return clamp(ratio) * scrollRange();
}

function jumpToRatio(ratio: number) {
  const { ScrollTrigger } = getGsap();
  const y = ratioToY(ratio);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
  ScrollTrigger.update();
}

/** Scrolls to a point inside a scene (0 = its first frame, 1 = its last). */
export function scrollToScene(id: SceneId, at = 0.02, immediate = false) {
  const seg = director.segments.find((s) => s.kind === "scene" && s.scene === id);
  if (!seg || !director.total) return false;
  scrollToY(ratioToY((seg.start + at * seg.length) / director.total), immediate);
  return true;
}

export function scrollToTop() {
  scrollToY(0);
}

/* ─────────────── Lifecycle ─────────────── */

function readSavedRatio() {
  try {
    const v = sessionStorage.getItem(SCROLL_KEY);
    return v === null ? null : clamp(parseFloat(v));
  } catch {
    return null;
  }
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      sessionStorage.setItem(SCROLL_KEY, director.pageProgress.toFixed(5));
    } catch {
      // Storage blocked — reload simply starts at the top.
    }
  }, 300);
}

function onResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const w = document.documentElement.clientWidth;
    const h = measureVh();
    // Mobile toolbars change innerHeight constantly; only real layout changes rebuild.
    if (w === lastWidth && Math.abs(h - lastHeight) < 2) return;
    build();
  }, 150);
}

export function startDirector() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  startLenis();
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScrollSettle, { passive: true });
  window.addEventListener("orientationchange", onResize);
  queueBuild();
  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    window.removeEventListener("scroll", onScrollSettle);
    gctx?.revert();
    gctx = null;
    master = null;
    trigger = null;
    director.ready = false;
  };
}

/** Pauses/resumes Lenis + the master timeline while the tab is hidden. */
export function setPaused(paused: boolean) {
  const lenis = getLenis();
  if (paused) lenis?.stop();
  else lenis?.start();
}

export const getTrigger = () => trigger;
