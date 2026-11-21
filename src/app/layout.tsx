import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description = site.statement;
const title = `${site.brand} — ${site.name.replace(/\b(\w)(\w*)/g, (_, a: string, b: string) => a + b.toLowerCase())}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: site.brand,
  authors: [{ name: "Hussnain Sohail" }],
  creator: "Hussnain Sohail",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: site.brand,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#111217",
  colorScheme: "dark",
  viewportFit: "cover",
};

// Runs before first paint: picks the experience mode so there is no flash of the wrong
// layout. No JS → neither class → the readable stacked page (Security.md §6 no-JS).
const modeScript = `(function(){var d=document.documentElement;d.classList.add('js');var rm=false;try{rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}d.classList.add(rm?'static':'cine');})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      style={{ backgroundColor: "#111217" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
