import { getSupabase } from "./supabase";
import type { Lead, LeadInput } from "./types";

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await getSupabase().from("leads").select("*").eq("id", id).single();
  if (error) return null;
  return data as Lead;
}

export async function createLead(input: Partial<LeadInput> & { nom: string; canal: string }) {
  const { data, error } = await getSupabase().from("leads").insert(input).select().single();
  if (error) throw error;
  return data as Lead;
}

export async function createLeadsBulk(inputs: Array<Partial<LeadInput> & { nom: string; canal: string }>) {
  const { data, error } = await getSupabase().from("leads").insert(inputs).select();
  if (error) throw error;
  return data as Lead[];
}

export async function updateLead(id: string, patch: Partial<LeadInput>) {
  const { data, error } = await getSupabase().from("leads").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as Lead;
}

export async function deleteLead(id: string) {
  const { error } = await getSupabase().from("leads").delete().eq("id", id);
  if (error) throw error;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function autoCloseStaleLeads(days = 14): Promise<{ closed: number; ids: string[] }> {
  const leads = await getLeads();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffISO = cutoff.toISOString().slice(0, 10);

  const toClose = leads.filter(
    (l) => l.statut === "Contacté" && l.date_contact_initial && l.date_contact_initial <= cutoffISO
  );
  if (toClose.length === 0) return { closed: 0, ids: [] };

  const ids = toClose.map((l) => l.id);
  const { error } = await getSupabase().from("leads").update({ statut: "Perdu" }).in("id", ids);
  if (error) throw error;
  return { closed: ids.length, ids };
}

export async function getRelances() {
  const leads = await getLeads();
  const today = todayISO();
  // Exclut "Nouveau" : un lead jamais contacté n'a rien à "relancer", même s'il a
  // une date_prochaine_relance posée (ex: valeur par défaut du formulaire de création).
  const exclus = ["Nouveau", "Gagné", "Perdu"];
  const enRetard = leads.filter(
    (l) => l.date_prochaine_relance && l.date_prochaine_relance < today && !exclus.includes(l.statut)
  );
  const aujourdhui = leads.filter((l) => l.date_prochaine_relance === today && !exclus.includes(l.statut));
  const in7 = new Date();
  in7.setDate(in7.getDate() + 7);
  const in7ISO = in7.toISOString().slice(0, 10);
  const aVenir = leads.filter(
    (l) =>
      l.date_prochaine_relance &&
      l.date_prochaine_relance > today &&
      l.date_prochaine_relance <= in7ISO &&
      !exclus.includes(l.statut)
  );
  return { enRetard, aujourdhui, aVenir };
}
