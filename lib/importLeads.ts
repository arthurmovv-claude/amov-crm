import { CANAUX, type LeadInput } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Une ligne = un prospect : "Nom, email ou lien/handle, canal, niche"
// canal et niche sont optionnels ; canal reconnu (Instagram/LinkedIn/Email) sinon Instagram par défaut.
// La position 2 est classée automatiquement selon sa forme (email valide vs lien/handle),
// indépendamment de ce que dit le canal — évite qu'une URL collée là casse le champ email.
export function parseImportLine(
  line: string
): (Partial<LeadInput> & { nom: string; canal: string }) | null {
  const parts = line.split(",").map((p) => p.trim());
  const [nom, contact, canalRaw, niche] = parts;
  if (!nom) return null;

  const canal = CANAUX.find((c) => c.toLowerCase() === (canalRaw || "").toLowerCase()) || "Instagram";

  let email: string | null = null;
  let handle: string | null = null;
  if (contact) {
    if (EMAIL_PATTERN.test(contact)) email = contact;
    else handle = contact;
  }

  return {
    nom,
    entreprise: null,
    email,
    handle,
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