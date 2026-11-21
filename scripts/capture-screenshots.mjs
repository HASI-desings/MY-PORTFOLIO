// Captures real screenshots of LIVE projects → public/projects/<slug>.webp (Phases.md §3.2).
// Run: npm run assets:screens. Never fakes a screenshot: a failed URL is reported and skipped,
// and that project keeps a typographic cover instead.
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { projects } from "../src/content/projects.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/projects");
const live = projects.filter((p) => p.status === "LIVE" && p.url?.startsWith("https://"));

if (live.length === 0) {
  process.stdout.write("No LIVE projects in src/content/projects.ts — nothing to capture.\n");
  process.exit(0);
}

await mkdir(outDir, { recursive: true });
const sharp = (await import("sharp")).default;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const failed = [];

for (const project of live) {
  try {
    await page.goto(project.url, { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(1500);
    const png = await page.screenshot({ type: "png" });
    const file = path.join(outDir, `${project.slug}.webp`);
    await sharp(png).webp({ quality: 82 }).toFile(file);
    process.stdout.write(`✓ ${project.slug} → ${path.relative(root, file)}\n`);
  } catch (error) {
    failed.push(project.slug);
    process.stderr.write(`✗ ${project.slug}: ${error.message.split("\n")[0]}\n`);
  }
}

await browser.close();
if (failed.length) {
  process.stderr.write(`Failed: ${failed.join(", ")} — keep their typographic covers.\n`);
  process.exitCode = 1;
}
