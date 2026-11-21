import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HASI DESIGNS — Hussnain Sohail",
  description:
    "I build digital experiences, automate processes, and transform ideas into functional software.",
};

export const viewport: Viewport = {
  themeColor: "#111217",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Inline obsidian so the very first paint is never white (Security.md §4).
    <html lang="en" style={{ backgroundColor: "#111217" }}>
      <body>{children}</body>
    </html>
  );
}
