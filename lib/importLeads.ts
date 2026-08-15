import { CANAUX, type LeadInput } from "./types";

// Une ligne = un prospect : "Nom, handle ou email, canal, niche"
// canal et niche sont optionnels ; canal reconnu (Instagram/LinkedIn/Email) sinon Instagram par défaut.
export function parseImportLine(
  line: string
): (Partial<LeadInput> & { nom: string; canal: string }) | null {
  const parts = line.split(",").map((p) => p.trim());
  const [nom, contact, canalRaw, niche] = parts;
  if (!nom) return null;

  const canal = CANAUX.find((c) => c.toLowerCase() === (canalRaw || "").toLowerCase()) || "Instagram";
  const isEmail = canal === "Email";

  return {
    nom,
    entreprise: null,
    email: isEmail && contact ? contact : null,
    handle: !isEmail && contact ? contact : null,
    canal,
    niche: niche || null,
    statut: "Nouveau",
    priorite: "Moyenne",
    detail_personnalisation: null,
    notes: null,
    date_contact_initial: null,
    date_derniere_action: null,
    date_prochaine_relance: null,
  };
}