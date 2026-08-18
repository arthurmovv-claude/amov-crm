"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { markRelancedAction } from "@/app/actions";
import type { Lead } from "@/lib/types";

export default function MarkRelancedButton({ lead }: { lead: Lead }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      await markRelancedAction(lead.id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title="Marquer comme relancé aujourd'hui"
      className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
    >
      <CheckCircle2 size={14} />
    </button>
  );
}