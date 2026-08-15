export const dynamic = "force-dynamic";

import Link from "next/link";
import { Upload } from "lucide-react";
import { getLeads } from "@/lib/data";
import LeadsTable from "@/components/LeadsTable";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="mb-1 text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted">{leads.length} lead{leads.length > 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/leads/import"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted transition hover:border-accent hover:text-accent"
        >
          <Upload size={16} />
          Importer
        </Link>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}