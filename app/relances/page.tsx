export const dynamic = "force-dynamic";

import { getRelances } from "@/lib/data";
import RelanceSection from "@/components/RelanceSection";

export default async function RelancesPage() {
  const { enRetard, aujourdhui, aVenir } = await getRelances();
  const total = enRetard.length + aujourdhui.length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Relances</h1>
      <p className="mb-6 text-sm text-muted">{total} relance{total > 1 ? "s" : ""} à traiter</p>

      <RelanceSection title="En retard" leads={enRetard} tone="retard" emptyLabel="Aucune relance en retard" />
      <RelanceSection title="Aujourd'hui" leads={aujourdhui} tone="aujourdhui" emptyLabel="Aucune relance prévue aujourd'hui" />
      <RelanceSection title="À venir (7 jours)" leads={aVenir} tone="avenir" emptyLabel="Aucune relance dans les 7 prochains jours" />
    </div>
  );
}
