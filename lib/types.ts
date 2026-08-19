export type Statut =
  | "Nouveau"
  | "Contacté"
  | "Répondu"
  | "Appel planifié"
  | "Offre envoyée"
  | "Gagné"
  | "Perdu";

export type Priorite = "Faible" | "Moyenne" | "Haute";

export type Canal = "Instagram" | "LinkedIn" | "Email";

export const STATUTS: Statut[] = [
  "Nouveau",
  "Contacté",
  "Répondu",
  "Appel planifié",
  "Offre envoyée",
  "Gagné",
  "Perdu",
];

export const PRIORITES: Priorite[] = ["Faible", "Moyenne", "Haute"];
export const CANAUX: Canal[] = ["Instagram", "LinkedIn", "Email"];

export const STATUT_COLOR: Record<Statut, string> = {
  "Nouveau": "var(--status-nouveau)",
  "Contacté": "var(--status-contacte)",
  "Répondu": "var(--status-repondu)",
  "Appel planifié": "var(--status-appel)",
  "Offre envoyée": "var(--status-offre)",
  "Gagné": "var(--status-gagne)",
  "Perdu": "var(--status-perdu)",
};

export interface Lead {
  id: string;
  nom: string;
  entreprise: string | null;
  email: string | null;
  handle: string | null;
  canal: Canal;
  niche: string | null;
  statut: Statut;
  priorite: Priorite;
  detail_personnalisation: string | null;
  notes: string | null;
  date_contact_initial: string | null; // ISO date
  date_derniere_action: string | null; // ISO date
  date_prochaine_relance: string | null; // ISO date
  created_at: string;
  updated_at: string;
}

export type LeadInput = Omit<Lead, "id" | "created_at" | "updated_at">;

// Progression naturelle du pipeline (hors "Perdu", qui est une sortie manuelle, pas une étape).
export const PROGRESSION: Statut[] = [
  "Nouveau",
  "Contacté",
  "Répondu",
  "Appel planifié",
  "Offre envoyée",
  "Gagné",
];

export function nextStatut(current: Statut): Statut | null {
  const idx = PROGRESSION.indexOf(current);
  if (idx === -1 || idx === PROGRESSION.length - 1) return null;
  return PROGRESSION[idx + 1];
}
