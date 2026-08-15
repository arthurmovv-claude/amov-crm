"use client";

import { Mail } from "lucide-react";
import type { Lead } from "@/lib/types";
import { buildRelanceEmail, buildGmailComposeUrl } from "@/lib/emailTemplates";

export default function EmailRelanceButton({ lead }: { lead: Lead }) {
  const email = lead.email;
  if (!email) return null;

  function handleClick() {
    const { subject, body } = buildRelanceEmail(lead);
    const url = buildGmailComposeUrl(email as string, subject, body);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
      title="Préparer l'email de relance dans Gmail"
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-muted transition hover:border-accent hover:text-accent"
    >
      <Mail size={14} />
      Relancer
    </button>
  );
}