"use client";

import { useTransition } from "react";
import Link from "next/link";
import { STATUTS, STATUT_COLOR, type Lead, type Statut } from "@/lib/types";
import { PriorityBadge } from "@/components/Badges";
import { updateLeadStatusAction } from "@/app/actions";

export default function PipelineBoard({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition();

  const byStatut: Record<Statut, Lead[]> = Object.fromEntries(
    STATUTS.map((s) => [s, leads.filter((l) => l.statut === s)])
  ) as Record<Statut, Lead[]>;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUTS.map((statut) => (
        <div key={statut} className="w-72 shrink-0 rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUT_COLOR[statut] }} />
              <span className="text-sm font-bold">{statut}</span>
            </div>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">
              {byStatut[statut].length}
            </span>
          </div>
          <div className="flex min-h-[120px] flex-col gap-2 p-3">
            {byStatut[statut].length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">Aucun lead</p>
            ) : (
              byStatut[statut].map((lead) => (
                <div key={lead.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Link href={`/leads/${lead.id}/edit`} className="text-sm font-bold hover:text-accent">
                      {lead.nom}
                    </Link>
                    <PriorityBadge priorite={lead.priorite} />
                  </div>
                  {lead.entreprise && <p className="mb-2 text-xs text-muted">{lead.entreprise}</p>}
                  <select
                    disabled={isPending}
                    value={lead.statut}
                    onChange={(e) => startTransition(() => updateLeadStatusAction(lead.id, e.target.value))}
                    className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
