"use server";

import { revalidatePath } from "next/cache";
import { createLead, updateLead, deleteLead } from "@/lib/data";
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
    date_contact_initial: strOrNull(formData.get("date_contact_initial")),
    date_derniere_action: strOrNull(formData.get("date_derniere_action")),
    date_prochaine_relance: strOrNull(formData.get("date_prochaine_relance")),
  };
  await updateLead(id, patch as Partial<LeadInput>);
  revalidatePath("/leads");
  revalidatePath("/pipeline");
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

function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = v ? String(v).trim() : "";
  return s.length ? s : null;
}
