import Link from "next/link";

// Branded 404 is designed in Phase 12 (Security.md §6).
export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <Link href="/">Back to HASI</Link>
    </main>
  );
}
