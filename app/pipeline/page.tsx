export const dynamic = "force-dynamic";

import { getLeads } from "@/lib/data";
import PipelineBoard from "@/components/PipelineBoard";

export default async function PipelinePage() {
  const leads = await getLeads();
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Pipeline</h1>
      <p className="mb-6 text-sm text-muted">Vue kanban de tes opportunités</p>
      <PipelineBoard leads={leads} />
    </div>
  );
}
