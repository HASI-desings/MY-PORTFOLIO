"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { final } from "@/content/final";
import { portrait } from "@/lib/portrait.generated";
import { cn } from "@/lib/utils";

/**
 * ME.png — the only image of the creator, shown only here (Rules.md §1.6, §2.6). Background
 * removed, nothing else changed. A red-tinted copy of the silhouette, offset toward the
 * light, sits right behind it as the thin red rim (Design.md §9 Scene 06). A tiny blurred
 * silhouette holds the space until the real image has loaded.
 */
const Portrait = forwardRef<HTMLDivElement>(function Portrait(_, ref) {
  const srcSet = portrait.widths.map((w) => `/me/me-${w}.webp ${w}w`).join(", ");
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // The image can finish before hydration, when React's onLoad is not attached yet.
  useEffect(() => {
    const el = img.current;
    if (!el) return;
    const done = () => setLoaded(true);
    if (el.complete && el.naturalWidth > 0) {
      const id = requestAnimationFrame(done);
      return () => cancelAnimationFrame(id);
    }
    el.addEventListener("load", done, { once: true });
    return () => el.removeEventListener("load", done);
  }, []);

  return (
    <div ref={ref} className="final-portrait absolute bottom-0" style={{ zIndex: 4 }}>
      <div className="final-rim absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundImage: `url(${portrait.placeholder})`,
          backgroundSize: "100% 100%",
          filter: "blur(12px)",
        }}
      />
      <picture>
        <source type="image/webp" srcSet={srcSet} sizes="(max-width: 639px) 120vw, 88svh" />
        <img
          ref={img}
          src={portrait.png}
          width={portrait.width}
          height={portrait.height}
          alt={final.portraitAlt}
          decoding="async"
          fetchPriority="low"
          className="relative block h-full w-full object-contain object-bottom"
        />
      </picture>
    </div>
  );
});

export default Portrait;
