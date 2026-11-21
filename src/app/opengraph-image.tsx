import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt =
  "HASI DESIGNS — Hussnain Sohail, Founder / Developer / Digital Creator, Lahore, Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 1200×630 share image: giant HASI, the red diagonal, the name (Structure.md). */
export default async function OpengraphImage() {
  const dir = join(process.cwd(), "src/app/_og");
  const [black, bold, regular] = await Promise.all([
    readFile(join(dir, "archivo-900-125.ttf")),
    readFile(join(dir, "archivo-800-100.ttf")),
    readFile(join(dir, "archivo-500-100.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#111217",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -80,
          top: 470,
          width: 1700,
          height: 150,
          background: "#EF233C",
          transform: "rotate(-18deg)",
          transformOrigin: "0% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 96,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Archivo Black",
          fontSize: 300,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "#DFE5EB",
        }}
      >
        {site.wordmark}
      </div>
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 56,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "20px 26px",
          background: "#111217",
        }}
      >
        <div
          style={{
            fontFamily: "Archivo Bold",
            fontSize: 44,
            color: "#DFE5EB",
            letterSpacing: "-0.01em",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontFamily: "Archivo",
            fontSize: 18,
            color: "rgba(223,229,235,.6)",
            letterSpacing: "0.08em",
          }}
        >
          {`${site.roles.join(" / ").toUpperCase()} · ${site.location.toUpperCase()}`}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Archivo Black", data: black, weight: 900, style: "normal" },
        { name: "Archivo Bold", data: bold, weight: 800, style: "normal" },
        { name: "Archivo", data: regular, weight: 500, style: "normal" },
      ],
    },
  );
}
