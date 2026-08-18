export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserPlus, Sparkles, Clock } from "lucide-react";
import { getLeads, getRelances } from "@/lib/data";
import { STATUTS } from "@/lib/types";

export default async function DashboardPage() {
  const leads = await getLeads();
  const { enRetard, aujourdhui } = await getRelances();

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
          <Sparkles className="text-accent" size={26} />
        </div>
        <h1 className="text-xl font-bold">Bienvenue dans ton CRM</h1>
        <p className="max-w-md text-sm text-muted">
          C&apos;est ici que tu vas suivre tous tes prospects et ne jamais oublier de les relancer.
          Commence par ajouter ton premier contact.
        </p>
        <Link
          href="/leads/new"
          className="mt-2 flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-hover"
        >
          <UserPlus size={16} />
          Ajouter mon premier contact
        </Link>
      </div>
    );
  }

  const gagnes = leads.filter((l) => l.statut === "Gagné").length;
  const enCours = leads.filter((l) => !["Gagné", "Perdu"].includes(l.statut)).length;
  const tauxReponse = leads.length
    ? Math.round(
        (leads.filter((l) => !["Nouveau", "Contacté"].includes(l.statut)).length / leads.length) * 100
      )
    : 0;

  const stats = [
    { label: "Leads actifs", value: enCours },
    { label: "Relances en retard", value: enRetard.length, danger: enRetard.length > 0 },
    { label: "Relances aujourd'hui", value: aujourdhui.length },
    { label: "Taux de réponse", value: `${tauxReponse}%` },
    { label: "Gagnés", value: gagnes },
  ];

  const seuilBacklog = new Date();
seuilBacklog.setDate(seuilBacklog.getDate() - 7);
const seuilISO = seuilBacklog.toISOString().slice(0, 10);
const backlog = leads.filter((l) => l.statut === "Nouveau" && l.created_at.slice(0, 10) <= seuilISO);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Vue d&apos;ensemble de ton activité commerciale</p>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.danger ? "text-accent" : ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {backlog.length > 0 && (
  <div className="mb-8 rounded-lg border border-border bg-surface p-4">
    <div className="mb-3 flex items-center gap-2">
      <Clock size={16} className="text-accent" />
      <h2 className="text-sm font-bold text-accent">
        En attente de premier contact depuis plus de 7 jours ({backlog.length})
      </h2>
    </div>
    <div className="space-y-1">
      {backlog.map((l) => (
        <Link
          key={l.id}
          href={`/leads/${l.id}/edit`}
          className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface-hover"
        >
          <span className="font-bold">{l.nom}</span>
          <span className="text-xs text-muted">
            {l.entreprise || l.canal} · sourcé le {l.created_at.slice(0, 10)}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}

      <div className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-bold text-muted">Répartition par statut</h2>
        <div className="space-y-2">
          {STATUTS.map((s) => {
            const count = leads.filter((l) => l.statut === s).length;
            const pct = leads.length ? (count / leads.length) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-muted">{s}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-xs text-muted">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
