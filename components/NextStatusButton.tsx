"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { updateLeadStatusAction } from "@/app/actions";
import { nextStatut, type Lead } from "@/lib/types";

export default function NextStatusButton({ lead }: { lead: Lead }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const next = nextStatut(lead.statut);
  if (!next) return null;

  function handleClick() {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, next as string);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={`Passer à "${next}"`}
      className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
    >
      <ChevronRight size={14} />
    </button>
  );
}