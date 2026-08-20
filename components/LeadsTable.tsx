"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Inbox } from "lucide-react";
import { STATUTS, PRIORITES, type Lead, type Statut, type Priorite } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { deleteLeadAction } from "@/app/actions";
import EmailRelanceButton from "@/components/EmailRelanceButton";
import ProfileLinkButton from "@/components/ProfileLinkButton";
import CopyMessageButton from "@/components/CopyMessageButton";
import NextStatusButton from "@/components/NextStatusButton";

const STATUT_PLURIEL: Record<Statut, string> = {
  "Nouveau": "Nouveaux",
  "Contacté": "Contactés",
  "Répondu": "Répondus",
  "Appel planifié": "Appels planifiés",
  "Offre envoyée": "Offres envoyées",
  "Gagné": "Gagnés",
  "Perdu": "Perdus",
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [statutFilter, setStatutFilter] = useState<Statut | null>(null);
  const [prioriteFilter, setPrioriteFilter] = useState<Priorite | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statutFilter && l.statut !== statutFilter) return false;
      if (prioriteFilter && l.priorite !== prioriteFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${l.nom} ${l.entreprise ?? ""} ${l.email ?? ""} ${l.handle ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, query, statutFilter, prioriteFilter]);

  function chipClass(active: boolean) {
    return `rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-border text-muted hover:text-foreground"
    }`;
  }

  return (
    <div>
      {statutFilter && (
        <p className="mb-4 text-sm font-bold text-accent">
          {filtered.length} {STATUT_PLURIEL[statutFilter]}
        </p>
      )}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
        <Search size={16} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, entreprise, email..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="mr-1 text-muted">Statut :</span>
        {STATUTS.map((s) => (
          <button key={s} onClick={() => setStatutFilter(statutFilter === s ? null : s)} className={chipClass(statutFilter === s)}>
            {s}
          </button>
        ))}
        <span className="ml-3 mr-1 text-muted">Priorité :</span>
        {PRIORITES.map((p) => (
          <button key={p} onClick={() => setPrioriteFilter(prioriteFilter === p ? null : p)} className={chipClass(prioriteFilter === p)}>
            {p}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
          <Inbox size={32} className="text-muted" />
          <p className="font-bold">Aucun lead trouvé</p>
          <p className="text-sm text-muted">Modifiez vos filtres ou créez un nouveau lead.</p>
          <Link href="/leads/new" className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
            + Nouveau lead
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs text-muted">
                <th className="px-4 py-3 font-bold">Nom</th>
                <th className="px-4 py-3 font-bold">Entreprise</th>
                <th className="px-4 py-3 font-bold">Canal</th>
                <th className="px-4 py-3 font-bold">Statut</th>
                <th className="px-4 py-3 font-bold">Priorité</th>
                <th className="px-4 py-3 font-bold">Prochaine relance</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3 font-bold">{l.nom}</td>
                  <td className="px-4 py-3 text-muted">{l.entreprise || "—"}</td>
                  <td className="px-4 py-3 text-muted">{l.canal}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge statut={l.statut} />
                      <NextStatusButton lead={l} />
                    </div>
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priorite={l.priorite} /></td>
                  <td className="px-4 py-3 text-muted">
  {l.statut === "Appel planifié" && l.date_appel
    ? new Date(l.date_appel).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " (appel)"
    : l.date_prochaine_relance || "—"}
</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <ProfileLinkButton lead={l} />
                      <CopyMessageButton lead={l} />
                      <EmailRelanceButton lead={l} compact />
                      <Link href={`/leads/${l.id}/edit`} title="Modifier" className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent">
                        <Pencil size={14} />
                      </Link>
                      <button
                        disabled={isPending}
                        onClick={() => {
                          if (confirm(`Supprimer ${l.nom} ?`)) {
                            startTransition(() => deleteLeadAction(l.id));
                          }
                        }}
                        title="Supprimer"
                        className="rounded-lg border border-border p-1.5 text-muted transition hover:border-accent hover:text-accent"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}