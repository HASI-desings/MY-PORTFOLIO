import type { Metadata } from "next";
import Link from "next/link";
import StatusPage from "@/components/ui/StatusPage";

export const metadata: Metadata = { title: "404 — HASI DESIGNS" };

export default function NotFound() {
  return (
    <StatusPage
      ghost="404"
      title="LOST IN THE PROCESS."
      line="This page doesn't exist — every idea starts somewhere, though."
    >
      <Link href="/" className="btn btn--primary btn--lg">
        <span className="btn__label">BACK TO HASI</span>
      </Link>
    </StatusPage>
  );
}
