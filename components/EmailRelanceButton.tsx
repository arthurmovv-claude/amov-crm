"use client";

import { Mail } from "lucide-react";
import type { Lead } from "@/lib/types";
import { buildRelanceEmail, buildGmailComposeUrl } from "@/lib/emailTemplates";

export default function EmailRelanceButton({ lead, compact = false }: { lead: Lead; compact?: boolean }) {
  const email = lead.email;
  if (!email) return null;

  function handleClick() {
    const { subject, body } = buildRelanceEmail(lead);
    const url = buildGmailComposeUrl(email as string, subject, body);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        title="Email de relance Gmail"
        className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent"
      >
        <Mail size={14} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      title="Email de relance Gmail"
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-muted transition hover:border-accent hover:text-accent"
    >
      <Mail size={14} />
      Relancer
    </button>
  );
}