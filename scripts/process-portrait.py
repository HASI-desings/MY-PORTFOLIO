#!/usr/bin/env python3
"""ME.png → transparent portrait set for Scene 06 (Phases.md §3.1).

Background removal only. The face, body shape and hair are never altered, retouched
or upscaled (Rules.md §1.6): interior pixels are copied unchanged, and only the
transition pixels at the silhouette edge are un-mixed from the backdrop.

Method (in order of preference):
  1. ME.png already has a real alpha channel → keep it.
  2. rembg, if it is installed and its model is available.
  3. Difference matte (the spec's luminance-key fallback, done carefully): the light
     studio backdrop is modelled from the visible background, and each edge pixel's
     opacity is how much it darkens that backdrop. Fine hair strands survive because
     nothing is blurred or thresholded hard at the edge.

Also measures the backdrop's radial light falloff, so Scene 06 can recreate the
photo's background exactly at any screen size (DECISIONS D-014).

Usage: python3 scripts/process-portrait.py [--src _brief/assets/ME.png] [--out public/me]
Requires: Pillow, numpy, scipy (rembg optional).
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SUBJECT_BLACK = 4.0  # luminance of the silhouette's darkest areas (measured: 1st percentile ≈ 1–5)


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., :3].astype(np.float64).mean(axis=2)


def normalized_blur(values: np.ndarray, weight: np.ndarray, sigma: float) -> np.ndarray:
    """Gaussian blur that ignores masked pixels — fills the hidden backdrop from what is visible."""
    num = ndimage.gaussian_filter(values * weight, sigma)
    den = ndimage.gaussian_filter(weight, sigma)
    return num / np.maximum(den, 1e-6)


def estimate_backdrop(lum: np.ndarray, exclude: np.ndarray, sigma: float) -> np.ndarray:
    weight = (~exclude).astype(np.float64)
    backdrop = normalized_blur(lum, weight, sigma)
    # Wide second pass fills areas far from any visible background (deep under the subject).
    wide = normalized_blur(lum, weight, sigma * 6)
    coverage = ndimage.gaussian_filter(weight, sigma)
    return np.where(coverage > 0.02, backdrop, wide)


def largest_components(mask: np.ndarray, keep_ratio: float = 0.02) -> np.ndarray:
    labels, n = ndimage.label(mask)
    if n == 0:
        return mask
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * keep_ratio]
    return np.isin(labels, keep)


def difference_matte(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Returns (alpha 0..1, decontaminated RGB, backdrop luminance)."""
    lum = luminance(rgb)

    # 1. Solid silhouette: clearly darker than the backdrop around it.
    rough_bg = estimate_backdrop(lum, lum < 90, sigma=40)
    core = lum < 0.45 * rough_bg
    core = ndimage.binary_opening(core, iterations=1)
    core = largest_components(core)
    # Enclosed gaps: lit skin stays solid; backdrop seen through hair or between the arms
    # and body (nearly as bright as the backdrop) becomes see-through.
    holes = ndimage.binary_fill_holes(core) & ~core
    labels, n = ndimage.label(holes)
    solid = core.copy()
    if n:
        peak = ndimage.maximum(lum, labels, range(1, n + 1))
        ref = ndimage.mean(rough_bg, labels, range(1, n + 1))
        skin = [i + 1 for i in range(n) if peak[i] < 0.8 * ref[i]]
        solid |= np.isin(labels, skin)

    # 2. Backdrop model, refined twice so stray hair does not darken the estimate.
    exclude = ndimage.binary_dilation(solid, iterations=40)
    backdrop = estimate_backdrop(lum, exclude, sigma=24)
    for _ in range(2):
        alpha_guess = np.clip((backdrop - lum) / np.maximum(backdrop - SUBJECT_BLACK, 1), 0, 1)
        exclude = ndimage.binary_dilation(solid | (alpha_guess > 0.03), iterations=3)
        backdrop = estimate_backdrop(lum, exclude, sigma=14)

    # Where the backdrop is visible within a few pixels (gaps in the hair), the brightest
    # nearby pixel is a better local reading of it than the smooth model.
    backdrop = np.maximum(backdrop, ndimage.grey_dilation(lum, size=15))

    # 3. Alpha: interior solid; edge band (2px inside → 48px outside) from the difference.
    #    The "true" colour of an edge pixel is read from the solid area right next to it:
    #    lit skin on the face profile, black at the hair. Assuming black everywhere would
    #    make the lit nose and lips semi-transparent.
    interior = ndimage.binary_erosion(solid, iterations=2)
    inside = interior.astype(np.float64)
    fg_near = normalized_blur(lum, inside, sigma=3)
    fg_cover = ndimage.gaussian_filter(inside, 3)
    foreground = np.where(fg_cover > 0.05, fg_near, SUBJECT_BLACK)
    alpha_diff = np.clip((backdrop - lum) / np.maximum(backdrop - foreground, 25), 0, 1)
    noise_floor = 0.035  # compression noise in the source backdrop
    alpha_diff = np.clip((alpha_diff - noise_floor) / (1 - noise_floor), 0, 1)
    near = ndimage.binary_dilation(solid, iterations=48)
    alpha = np.where(interior, 1.0, np.where(near, alpha_diff, 0.0))
    # Thin highlight seams inside the silhouette (e.g. the lit nose ridge) are skin, not
    # backdrop: if a narrow gap closes up and the pixel is mostly dark, it is opaque.
    seams = ndimage.binary_closing(solid, iterations=3) & ~solid
    alpha = np.where(seams & (alpha_diff > 0.35), 1.0, alpha)
    # Hair strands must stay connected to the subject — drop isolated specks of backdrop noise.
    alpha[~largest_components(alpha > 0.02, keep_ratio=0.0005)] = 0.0

    # 4. Un-mix edge pixels from the backdrop (compositing equation), interior untouched.
    out = rgb[..., :3].astype(np.float64).copy()
    edge = (~interior) & (alpha > 0)
    a = alpha[edge][:, None]
    b = backdrop[edge][:, None]
    unmixed = (out[edge] - (1 - a) * b) / np.maximum(a, 1e-3)
    # Faint strands give unstable colour; use the colour of the subject next to them.
    unmixed = np.where(a < 0.2, foreground[edge][:, None], unmixed)
    out[edge] = np.clip(unmixed, 0, 255)
    return alpha, out, backdrop


def try_rembg(img: Image.Image) -> Image.Image | None:
    try:
        from rembg import new_session, remove  # type: ignore[import-not-found]

        return remove(img, session=new_session("u2net_human_seg"))
    except Exception as exc:  # missing package or blocked model download
        print(f"rembg unavailable ({type(exc).__name__}) → difference matte", file=sys.stderr)
        return None


def measure_backdrop(lum: np.ndarray, alpha: np.ndarray) -> dict:
    """Fit an elliptical radial falloff to the visible backdrop, in fractions of the photo."""
    h, w = lum.shape
    visible = ~ndimage.binary_dilation(alpha > 0.01, iterations=12)
    ys, xs = np.nonzero(visible)
    take = np.random.default_rng(7).choice(len(xs), size=min(60000, len(xs)), replace=False)
    xs, ys, vals = xs[take] / w, ys[take] / h, lum[ys[take], xs[take]]

    best = None
    for cx in np.linspace(0.40, 0.60, 9):
        for cy in np.linspace(0.40, 0.80, 17):
            for aspect in np.linspace(0.6, 2.0, 15):
                r = np.sqrt(((xs - cx) * aspect) ** 2 + (ys - cy) ** 2)
                coeffs = np.polyfit(r, vals, 4)
                err = np.sqrt(np.mean((np.polyval(coeffs, r) - vals) ** 2))
                if best is None or err < best[0]:
                    best = (err, cx, cy, aspect, coeffs)
    err, cx, cy, aspect, coeffs = best
    r_all = np.sqrt(((xs - cx) * aspect) ** 2 + (ys - cy) ** 2)
    r_min = float(np.percentile(r_all, 0.5))  # closer than this the backdrop is hidden by him
    stops = []
    for r in np.linspace(0, 1.0, 11):
        v = float(np.clip(np.polyval(coeffs, max(r, r_min)), 0, 255))
        stops.append({"r": round(float(r), 2), "grey": int(round(v))})
    # Light falls off monotonically from the hidden centre — never brighter further out.
    for i in range(1, len(stops)):
        stops[i]["grey"] = min(stops[i]["grey"], stops[i - 1]["grey"])
    for st in stops:
        st["hex"] = "#{0:02X}{0:02X}{0:02X}".format(st["grey"])
    return {
        "note": "Radial falloff of ME.png's backdrop. r is the distance from the centre, measured in photo heights; the x distance is multiplied by `aspect`.",
        "centerX": round(float(cx), 3),
        "centerY": round(float(cy), 3),
        "aspect": round(float(aspect), 3),
        "rmsError": round(float(err), 2),
        "stops": stops,
    }


def save_set(rgba: Image.Image, out_dir: Path) -> list[tuple[str, int]]:
    out_dir.mkdir(parents=True, exist_ok=True)
    for stale in [*out_dir.glob("me-*.webp"), *out_dir.glob("me-*.png")]:
        stale.unlink()  # widths follow the source, so old sizes must not linger
    native = rgba.width
    # Three widths, never larger than the source (no upscaling — Rules.md §1.6).
    widths = sorted({native, min(native, 640), min(native, 400)}, reverse=True)
    written: list[tuple[str, int]] = []
    for target in widths:
        img = rgba if target == native else rgba.resize(
            (target, round(rgba.height * target / native)), Image.Resampling.LANCZOS
        )
        path = out_dir / f"me-{target}.webp"
        img.save(path, "WEBP", quality=82, alpha_quality=100, method=6)
        written.append((path.name, path.stat().st_size))
    png = out_dir / f"me-{native}.png"
    rgba.save(png, "PNG", optimize=True)
    written.append((png.name, png.stat().st_size))

    tiny = rgba.resize((24, round(rgba.height * 24 / native)), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    tiny.save(buf, "WEBP", quality=60)
    (out_dir / "me-placeholder.txt").write_text(
        "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode() + "\n"
    )
    written.append(("me-placeholder.txt", (out_dir / "me-placeholder.txt").stat().st_size))
    return written


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--src", default=str(ROOT / "_brief/assets/ME.png"))
    parser.add_argument("--out", default=str(ROOT / "public/me"))
    parser.add_argument("--method", choices=["auto", "rembg", "key"], default="auto")
    args = parser.parse_args()

    src = Image.open(args.src)
    rgb = np.asarray(src.convert("RGB"))
    lum = luminance(rgb)

    has_alpha = src.mode in ("RGBA", "LA") and np.asarray(src.getchannel("A")).min() < 250
    if has_alpha:
        method, result = "existing alpha", src.convert("RGBA")
    else:
        cut = try_rembg(src.convert("RGB")) if args.method in ("auto", "rembg") else None
        if cut is not None:
            method, result = "rembg", cut.convert("RGBA")
        else:
            alpha, colour, _ = difference_matte(rgb)
            method = "difference matte"
            rgba = np.dstack([colour, alpha * 255]).round().astype(np.uint8)
            result = Image.fromarray(rgba, "RGBA")

    a = np.asarray(result.getchannel("A")).astype(np.float64) / 255
    box = Image.fromarray((a > 0.01).astype(np.uint8) * 255).getbbox()
    trimmed = result.crop(box)
    written = save_set(trimmed, Path(args.out))

    report = {
        "method": method,
        "source": [src.width, src.height],
        "trimBox": box,
        "output": [trimmed.width, trimmed.height],
        "files": {name: size for name, size in written},
        "totalKB": round(sum(size for _, size in written) / 1024, 1),
        "backdrop": measure_backdrop(lum, a),
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
