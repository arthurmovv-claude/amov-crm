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

export async function getRelances() {
  const leads = await getLeads();
  const today = todayISO();
  const enRetard = leads.filter(
    (l) => l.date_prochaine_relance && l.date_prochaine_relance < today && !["Gagné", "Perdu"].includes(l.statut)
  );
  const aujourdhui = leads.filter((l) => l.date_prochaine_relance === today && !["Gagné", "Perdu"].includes(l.statut));
  const in7 = new Date();
  in7.setDate(in7.getDate() + 7);
  const in7ISO = in7.toISOString().slice(0, 10);
  const aVenir = leads.filter(
    (l) =>
      l.date_prochaine_relance &&
      l.date_prochaine_relance > today &&
      l.date_prochaine_relance <= in7ISO &&
      !["Gagné", "Perdu"].includes(l.statut)
  );
  return { enRetard, aujourdhui, aVenir };
}
