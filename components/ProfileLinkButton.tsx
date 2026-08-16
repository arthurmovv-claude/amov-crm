import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Lead } from "@/lib/types";
import { buildProfileUrl } from "@/lib/links";

export default function ProfileLinkButton({ lead }: { lead: Lead }) {
  const url = buildProfileUrl(lead);
  if (!url) return null;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Ouvrir le profil"
      className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent"
    >
      <ExternalLink size={14} />
    </Link>
  );
}