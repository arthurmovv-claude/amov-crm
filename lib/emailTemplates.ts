import type { Lead } from "./types";

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - d.getTime()) / 86400000);
}

function firstName(nom: string): string {
  return nom.trim().split(" ")[0] || nom;
}

export type RelanceStage = "initial" | "j3" | "j7";

export function getRelanceStage(lead: Lead): RelanceStage {
  const jours = daysSince(lead.date_contact_initial);
  if (jours === null || lead.statut === "Nouveau") return "initial";
  if (jours < 6) return "j3";
  return "j7";
}

export function buildRelanceEmail(lead: Lead): { subject: string; body: string } {
  const prenom = firstName(lead.nom);
  const stage = getRelanceStage(lead);
  const detail = lead.detail_personnalisation?.trim();
  const contexte = lead.entreprise || lead.niche || "votre contenu";

  if (stage === "initial") {
    return {
      subject: `Une idée pour ${lead.entreprise || "vos vidéos"}`,
      body: `Bonjour ${prenom},

${detail ? detail + "\n\n" : ""}En tant que monteur vidéo spécialisé pour les créateurs, je pense pouvoir vous aider à gagner du temps et à professionnaliser le rendu de vos vidéos.

Seriez-vous ouvert à en discuter rapidement ?`,
    };
  }

  if (stage === "j3") {
    return {
      subject: `Petite relance${lead.entreprise ? " – " + lead.entreprise : ""}`,
      body: `Bonjour ${prenom},

Je me permets de revenir vers vous suite à mon message au sujet de ${contexte} — pas de souci si le timing n'est pas bon.

Je peux vous montrer un exemple concret si ça vous intéresse, ça prend deux minutes à regarder.

Bonne journée,`,
    };
  }

  return {
    subject: `Dernière relance${lead.entreprise ? " – " + lead.entreprise : ""}`,
    body: `Bonjour ${prenom},

Je n'ai pas eu de retour suite à mes précédents messages, donc je ne vais pas insister davantage de ce côté.

Si le sujet vous intéresse à l'avenir, la porte reste ouverte — n'hésitez pas à revenir vers moi.

Bonne continuation,`,
  };
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  const params = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}