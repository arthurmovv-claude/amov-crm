import Link from "next/link";
import { AlertTriangle, Clock, CalendarDays } from "lucide-react";
import type { Lead } from "@/lib/types";
import { StatusBadge } from "@/components/Badges";

const ICONS = { retard: AlertTriangle, aujourdhui: Clock, avenir: CalendarDays };

export default function RelanceSection({
  title,
  leads,
  tone,
  emptyLabel,
}: {
  title: string;
  leads: Lead[];
  tone: "retard" | "aujourdhui" | "avenir";
  emptyLabel: string;
}) {
  const Icon = ICONS[tone];
  const color = tone === "retard" ? "var(--status-perdu)" : tone === "aujourdhui" ? "var(--accent)" : "var(--muted)";

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} style={{ color }} />
        <h2 className="text-sm font-bold" style={{ color: tone === "avenir" ? undefined : color }}>{title}</h2>
        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">{leads.length}</span>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        {leads.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">{emptyLabel}</p>
        ) : (
          leads.map((lead, i) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}/edit`}
              className={`flex items-center justify-between px-4 py-3 hover:bg-surface-hover ${
                i !== leads.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <p className="text-sm font-bold">{lead.nom}</p>
                <p className="text-xs text-muted">{lead.entreprise || lead.canal} · {lead.date_prochaine_relance}</p>
              </div>
              <StatusBadge statut={lead.statut} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
