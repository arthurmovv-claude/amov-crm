"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { STATUTS, PRIORITES, CANAUX, type Lead, type Statut } from "@/lib/types";
import { createLeadAction, updateLeadAction } from "@/app/actions";

function addDays(dateStr: string, days: number): string {
  const base = dateStr ? new Date(dateStr) : new Date();
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LeadForm({ lead }: { lead?: Lead }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(lead);

  const [statut, setStatut] = useState<Statut>(lead?.statut ?? "Nouveau");
  const [dateContact, setDateContact] = useState(
    lead?.date_contact_initial ?? new Date().toISOString().slice(0, 10)
  );
  const [dateRelance, setDateRelance] = useState(
    lead?.date_prochaine_relance ?? addDays(dateContact, 3)
  );

  const appelExistant = lead?.date_appel ? new Date(lead.date_appel) : null;
  const [dateAppel, setDateAppel] = useState(
    appelExistant ? appelExistant.toISOString().slice(0, 10) : ""
  );
  const [heureAppel, setHeureAppel] = useState(
    appelExistant ? appelExistant.toISOString().slice(11, 16) : ""
  );

  function markContactedNow() {
    const today = todayISO();
    setStatut("Contacté");
    setDateContact(today);
    setDateRelance(addDays(today, 3));
  }

  function handleSubmit(formData: FormData) {
    formData.set("date_contact_initial", dateContact);
    formData.set("date_prochaine_relance", dateRelance);
    if (dateAppel) {
      formData.set("date_appel", new Date(`${dateAppel}T${heureAppel || "00:00"}`).toISOString());
    }
    startTransition(async () => {
      if (isEdit && lead) {
        await updateLeadAction(lead.id, formData);
      } else {
        await createLeadAction(formData);
      }
      router.push("/leads");
      router.refresh();
    });
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent";
  const labelClass = "mb-1.5 block text-xs font-bold text-muted";
  const quickBtnClass =
    "rounded-md border border-border px-2 py-1 text-xs font-bold text-muted transition hover:border-accent hover:text-accent";

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom / Prénom *</label>
          <input name="nom" required defaultValue={lead?.nom} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Entreprise / Compte</label>
          <input name="entreprise" defaultValue={lead?.entreprise ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Canal</label>
          <select name="canal" defaultValue={lead?.canal ?? "Instagram"} className={inputClass}>
            {CANAUX.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Lien / Handle / Email</label>
          <input name="handle" defaultValue={lead?.handle ?? ""} className={inputClass} placeholder="@handle ou url" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" defaultValue={lead?.email ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Niche</label>
          <input name="niche" defaultValue={lead?.niche ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Statut</label>
          <select
            name="statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value as Statut)}
            className={inputClass}
          >
            {STATUTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {statut !== "Contacté" && (
            <button
              type="button"
              onClick={markContactedNow}
              className="mt-1.5 text-xs font-bold text-accent hover:underline"
            >
              Marquer comme contacté aujourd&apos;hui →
            </button>
          )}
        </div>
        <div>
          <label className={labelClass}>Priorité</label>
          <select name="priorite" defaultValue={lead?.priorite ?? "Moyenne"} className={inputClass}>
            {PRIORITES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {statut === "Appel planifié" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date de l&apos;appel</label>
            <input
              type="date"
              value={dateAppel}
              onChange={(e) => setDateAppel(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Heure de l&apos;appel</label>
            <input
              type="time"
              value={heureAppel}
              onChange={(e) => setHeureAppel(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Détail de personnalisation utilisé</label>
        <textarea
          name="detail_personnalisation"
          defaultValue={lead?.detail_personnalisation ?? ""}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Date contact initial</label>
          <input
            type="date"
            value={dateContact}
            onChange={(e) => setDateContact(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Date dernière action</label>
          <input
            type="date"
            name="date_derniere_action"
            defaultValue={lead?.date_derniere_action ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Date prochaine relance</label>
          <input
            type="date"
            value={dateRelance}
            onChange={(e) => setDateRelance(e.target.value)}
            className={inputClass}
          />
          <div className="mt-2 flex gap-1.5">
            <button type="button" onClick={() => setDateRelance(addDays(dateContact, 3))} className={quickBtnClass}>
              J+3
            </button>
            <button type="button" onClick={() => setDateRelance(addDays(dateContact, 7))} className={quickBtnClass}>
              J+7
            </button>
            <button type="button" onClick={() => setDateRelance(addDays(dateContact, 14))} className={quickBtnClass}>
              J+14
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea name="notes" defaultValue={lead?.notes ?? ""} rows={3} className={inputClass} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer le lead"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-bold text-muted transition hover:text-foreground"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}