export const dynamic = "force-dynamic";

import { getLeads } from "@/lib/data";
import LeadsTable from "@/components/LeadsTable";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Leads</h1>
      <p className="mb-6 text-sm text-muted">{leads.length} lead{leads.length > 1 ? "s" : ""}</p>
      <LeadsTable leads={leads} />
    </div>
  );
}
