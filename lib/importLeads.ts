import { CANAUX, type LeadInput, type Lead } from "./types";

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

function normalize(v: string | null | undefined): string | null {
  if (!v) return null;
  const n = v.trim().toLowerCase().replace(/^@/, "").replace(/\/+$/, "");
  return n.length ? n : null;
}

// Compare les leads à importer aux leads déjà en base (par handle/email normalisés),
// et entre eux (au cas où la même personne apparaît deux fois dans le même collage).
export function dedupeImports(
  parsed: Array<Partial<LeadInput> & { nom: string; canal: string }>,
  existing: Lead[]
): {
  toCreate: Array<Partial<LeadInput> & { nom: string; canal: string }>;
  duplicates: string[];
} {
  const existingHandles = new Set(
    existing.map((l) => normalize(l.handle)).filter((v): v is string => Boolean(v))
  );
  const existingEmails = new Set(
    existing.map((l) => normalize(l.email)).filter((v): v is string => Boolean(v))
  );

  const seenHandles = new Set<string>();
  const seenEmails = new Set<string>();
  const toCreate: typeof parsed = [];
  const duplicates: string[] = [];

  for (const item of parsed) {
    const h = normalize(item.handle);
    const e = normalize(item.email);

    const isDuplicate =
      (h !== null && (existingHandles.has(h) || seenHandles.has(h))) ||
      (e !== null && (existingEmails.has(e) || seenEmails.has(e)));

    if (isDuplicate) {
      duplicates.push(item.nom);
      continue;
    }

    if (h) seenHandles.add(h);
    if (e) seenEmails.add(e);
    toCreate.push(item);
  }

  return { toCreate, duplicates };
}