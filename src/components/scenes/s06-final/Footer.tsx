import { site } from "@/content/site";

/** The last line of the page (Design.md §9 Scene 06). */
export default function Footer() {
  return (
    <footer
      className="final-footer t-mono absolute inset-x-0 text-center text-[11px]"
      style={{ bottom: "calc(16px + var(--safe-bottom))", zIndex: 6 }}
    >
      © {site.year} {site.brand} · {site.location.toUpperCase()}
    </footer>
  );
}
