"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { updateLeadStatusAction, scheduleAppelAction } from "@/app/actions";
import { nextStatut, type Lead } from "@/lib/types";
import ScheduleCallModal from "@/components/ScheduleCallModal";

export default function NextStatusButton({ lead }: { lead: Lead }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const next = nextStatut(lead.statut);
  if (!next) return null;

  function handleClick() {
    if (next === "Appel planifié") {
      setShowModal(true);
      return;
    }
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, next as string);
      router.refresh();
    });
  }

  function handleConfirmCall(isoDateTime: string) {
    setShowModal(false);
    startTransition(async () => {
      await scheduleAppelAction(lead.id, isoDateTime);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
        title={`Passer à "${next}"`}
        className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
      >
        <ChevronRight size={14} />
      </button>
      {showModal && <ScheduleCallModal onConfirm={handleConfirmCall} onCancel={() => setShowModal(false)} />}
    </>
  );
}