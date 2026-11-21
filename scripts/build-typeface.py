#!/usr/bin/env python3
"""Archivo (variable, OFL) → the font files the site generates itself (DECISIONS D-007).

1. public/fonts/archivo-black.typeface.json — the 3D HASI letters (three.js FontLoader /
   facetype.js format), instanced at wght 900 · wdth 125: exactly the shape the DOM letters
   use, so the loader → Scene 01 handoff is seamless.
2. src/app/_og/archivo-*.ttf — tiny static subsets for the generated Open Graph image
   (the OG renderer cannot read variable woff2).

Usage: python3 scripts/build-typeface.py [--src path/to/Archivo-variable.(ttf|woff2)]
Without --src the latin variable font is fetched from Google Fonts.
Requires: fonttools, brotli.
"""

from __future__ import annotations

import argparse
import io
import json
import re
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.pens.basePen import BasePen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
CSS_URL = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"

GLYPHS_3D = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
OG_TEXT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,/—-·'’&"
OG_INSTANCES = {"archivo-900-125.ttf": (900, 125), "archivo-800-100.ttf": (800, 100), "archivo-500-100.ttf": (500, 100)}


def fetch_variable_font() -> bytes:
    req = urllib.request.Request(CSS_URL, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req, timeout=30).read().decode()
    block = css[css.index("/* latin */") :]
    url = re.search(r"url\((https://[^)]+)\)", block).group(1)
    return urllib.request.urlopen(url, timeout=30).read()


def instance(data: bytes, wght: int, wdth: int) -> TTFont:
    font = TTFont(io.BytesIO(data))
    inst = instantiateVariableFont(font, {"wght": wght, "wdth": wdth})
    inst.flavor = None
    return inst


class FacetypePen(BasePen):
    """Records outlines in facetype.js order: `q`/`b` list the end point before controls."""

    def __init__(self, glyph_set):
        super().__init__(glyph_set)
        self.cmds: list[str] = []

    @staticmethod
    def _n(v: float) -> str:
        return str(round(v))

    def _moveTo(self, p):
        self.cmds += ["m", self._n(p[0]), self._n(p[1])]

    def _lineTo(self, p):
        self.cmds += ["l", self._n(p[0]), self._n(p[1])]

    def _qCurveToOne(self, c, p):
        self.cmds += ["q", self._n(p[0]), self._n(p[1]), self._n(c[0]), self._n(c[1])]

    def _curveToOne(self, c1, c2, p):
        self.cmds += ["b", self._n(p[0]), self._n(p[1]), self._n(c1[0]), self._n(c1[1]), self._n(c2[0]), self._n(c2[1])]


def typeface_json(font: TTFont) -> dict:
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    hmtx = font["hmtx"]
    glyphs = {}
    for ch in GLYPHS_3D:
        name = cmap.get(ord(ch))
        if not name:
            continue
        pen = FacetypePen(glyph_set)
        glyph_set[name].draw(pen)
        bounds = BoundsPen(glyph_set)
        glyph_set[name].draw(bounds)
        x_min, _, x_max, _ = bounds.bounds or (0, 0, 0, 0)
        glyphs[ch] = {
            "ha": hmtx[name][0],
            "x_min": round(x_min),
            "x_max": round(x_max),
            "o": " ".join(pen.cmds),
        }
    head, hhea, post = font["head"], font["hhea"], font["post"]
    return {
        "glyphs": glyphs,
        "familyName": "Archivo",
        "ascender": hhea.ascent,
        "descender": hhea.descent,
        "underlinePosition": post.underlinePosition,
        "underlineThickness": post.underlineThickness,
        "boundingBox": {"yMin": head.yMin, "xMin": head.xMin, "yMax": head.yMax, "xMax": head.xMax},
        "resolution": head.unitsPerEm,
        "original_font_information": {
            "format": 0,
            "fontFamily": "Archivo",
            "fontSubfamily": "wght 900 · wdth 125 (instance)",
            "copyright": "Copyright 2020 The Archivo Project Authors (https://github.com/Omnibus-Type/Archivo)",
            "licence_description": "SIL Open Font License, Version 1.1",
        },
        "cssFontWeight": "900",
        "cssFontStyle": "normal",
    }


def write_og_subset(data: bytes, wght: int, wdth: int, path: Path) -> None:
    font = instance(data, wght, wdth)
    opts = subset.Options()
    opts.layout_features = ["kern"]
    opts.name_IDs = ["*"]
    sub = subset.Subsetter(options=opts)
    sub.populate(text=OG_TEXT)
    sub.subset(font)
    font.save(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", help="Archivo variable font file (ttf/woff2)")
    args = parser.parse_args()
    data = Path(args.src).read_bytes() if args.src else fetch_variable_font()

    out_json = ROOT / "public/fonts/archivo-black.typeface.json"
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(typeface_json(instance(data, 900, 125)), separators=(",", ":")))
    print(f"{out_json.relative_to(ROOT)}  {out_json.stat().st_size / 1024:.1f} KB")

    og_dir = ROOT / "src/app/_og"
    og_dir.mkdir(parents=True, exist_ok=True)
    for name, (wght, wdth) in OG_INSTANCES.items():
        path = og_dir / name
        write_og_subset(data, wght, wdth, path)
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
