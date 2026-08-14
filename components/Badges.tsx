import { STATUT_COLOR, type Statut, type Priorite } from "@/lib/types";

export function StatusDot({ statut }: { statut: Statut }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: STATUT_COLOR[statut] }}
      />
      <span className="text-sm font-bold">{statut}</span>
    </span>
  );
}

export function StatusBadge({ statut }: { statut: Statut }) {
  const color = STATUT_COLOR[statut];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold"
      style={{ borderColor: color, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {statut}
    </span>
  );
}

const PRIORITY_COLOR: Record<Priorite, string> = {
  Faible: "#6b7280",
  Moyenne: "#d4a72b",
  Haute: "#d42b2b",
};

export function PriorityBadge({ priorite }: { priorite: Priorite }) {
  const color = PRIORITY_COLOR[priorite];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {priorite}
    </span>
  );
}
