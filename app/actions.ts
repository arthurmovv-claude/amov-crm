"use server";

import { revalidatePath } from "next/cache";
import { createLead, updateLead, deleteLead, createLeadsBulk, getLead, getLeads } from "@/lib/data";
import { parseImportLine, dedupeImports } from "@/lib/importLeads";
import type { LeadInput } from "@/lib/types";

export async function createLeadAction(formData: FormData) {
  const input: Record<string, unknown> = {
    nom: String(formData.get("nom") || "").trim(),
    entreprise: strOrNull(formData.get("entreprise")),
    email: strOrNull(formData.get("email")),
    handle: strOrNull(formData.get("handle")),
    canal: String(formData.get("canal") || "Instagram"),
    niche: strOrNull(formData.get("niche")),
    statut: String(formData.get("statut") || "Nouveau"),
    priorite: String(formData.get("priorite") || "Moyenne"),
    detail_personnalisation: strOrNull(formData.get("detail_personnalisation")),
    notes: strOrNull(formData.get("notes")),
    date_contact_initial: strOrNull(formData.get("date_contact_initial")),
    date_derniere_action: strOrNull(formData.get("date_derniere_action")),
    date_prochaine_relance: strOrNull(formData.get("date_prochaine_relance")),
    date_appel: strOrNull(formData.get("date_appel")),
  };
  if (!input.nom) throw new Error("Le nom est requis.");
  await createLead(input as Partial<LeadInput> & { nom: string; canal: string });
  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/relances");
  revalidatePath("/");
}

export async function updateLeadAction(id: string, formData: FormData) {
  const patch: Record<string, unknown> = {
    nom: String(formData.get("nom") || "").trim(),
    entreprise: strOrNull(formData.get("entreprise")),
    email: strOrNull(formData.get("email")),
    handle: strOrNull(formData.get("handle")),
    canal: String(formData.get("canal") || "Instagram"),
    niche: strOrNull(formData.get("niche")),
    statut: String(formData.get("statut") || "Nouveau"),
    priorite: String(formData.get("priorite") || "Moyenne"),
    detail_personnalisation: strOrNull(formData.get("detail_personnalisation")),
    notes: strOrNull(formData.get("notes")),
    date_derniere_action: strOrNull(formData.get("date_derniere_action")),
    date_prochaine_relance: strOrNull(formData.get("date_prochaine_relance")),
    date_appel: strOrNull(formData.get("date_appel")),
  };
  await updateLead(id, patch as Partial<LeadInput>);
  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/relances");
  revalidatePath("/");
}

export async function scheduleAppelAction(id: string, dateAppelISO: string) {
  await updateLead(id, { statut: "Appel planifié", date_appel: dateAppelISO } as Partial<LeadInput>);
  revalidatePath("/pipeline");
  revalidatePath("/leads");
  revalidatePath("/relances");
  revalidatePath("/");
}

export async function updateLeadStatusAction(id: string, statut: string) {
  await updateLead(id, { statut } as Partial<LeadInput>);
  revalidatePath("/pipeline");
  revalidatePath("/leads");
  revalidatePath("/relances");
  revalidatePath("/");
}

export async function deleteLeadAction(id: string) {
  await deleteLead(id);
  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/relances");
  revalidatePath("/");
}

export async function bulkImportLeadsAction(formData: FormData) {
  const raw = String(formData.get("data") || "");
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  const parsed: Array<Partial<LeadInput> & { nom: string; canal: string }> = [];
  const skipped: number[] = [];

  lines.forEach((line, i) => {
    const p = parseImportLine(line);
    if (p) parsed.push(p);
    else skipped.push(i + 1);
  });

  const existing = await getLeads();
  const { toCreate, duplicates } = dedupeImports(parsed, existing);

  if (toCreate.length > 0) {
    await createLeadsBulk(toCreate);
  }

  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/relances");
  revalidatePath("/");

  return { imported: toCreate.length, skipped, duplicates };
}

export async function markRelancedAction(id: string) {
  const lead = await getLead(id);
  if (!lead) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().slice(0, 10);

  let nextRelance: string | null = null;
  if (lead.date_contact_initial) {
    const contact = new Date(lead.date_contact_initial + "T00:00:00");
    const daysSinceContact = Math.round((today.getTime() - contact.getTime()) / 86400000);
    if (daysSinceContact < 6) {
      // C'était la relance J+3 → on programme la relance J+7.
      const j7 = new Date(contact);
      j7.setDate(j7.getDate() + 7);
      nextRelance = j7.toISOString().slice(0, 10);
    }
    // Sinon : c'était la relance J+7 (ou plus tard) → pas de nouvelle relance programmée,
    // l'auto-clôture à J+14 prendra le relais si toujours sans réponse.
  }

  await updateLead(id, {
    date_derniere_action: todayISO,
    date_prochaine_relance: nextRelance,
  });

  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/relances");
  revalidatePath("/");
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = v ? String(v).trim() : "";
  return s.length ? s : null;
}
