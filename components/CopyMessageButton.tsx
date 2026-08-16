"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Lead } from "@/lib/types";

export default function CopyMessageButton({ lead }: { lead: Lead }) {
  const [copied, setCopied] = useState(false);
  const text = lead.detail_personnalisation?.trim();
  if (!text) return null;

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Presse-papier indisponible — on ignore silencieusement.
    }
  }

  return (
    <button
      onClick={handleClick}
      title="Copier le message (détail personnalisation)"
      className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent"
    >
      {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
    </button>
  );
}