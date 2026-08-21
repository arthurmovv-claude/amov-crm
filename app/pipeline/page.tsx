export const dynamic = "force-dynamic";

import { getLeads } from "@/lib/data";
import PipelineBoard from "@/components/PipelineBoard";

export default async function PipelinePage() {
  const leads = await getLeads();
  return (
    <div>
  <div className="sticky top-0 z-30 -mx-6 mb-6 border-b border-border bg-background px-6 pb-4 pt-2">
    <h1 className="mb-1 text-3xl font-bold text-accent">Pipeline</h1>
    <p className="text-sm text-muted">Vue kanban de tes opportunités</p>
  </div>
  <PipelineBoard leads={leads} />
</div>
  );
}
