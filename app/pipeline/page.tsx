export const dynamic = "force-dynamic";

import { getLeads } from "@/lib/data";
import PipelineBoard from "@/components/PipelineBoard";
import DailyVerse from "@/components/DailyVerse";

export default async function PipelinePage() {
  const leads = await getLeads();
  return (
    <div>
  <div className="sticky top-0 z-30 mb-6 flex items-center gap-6 border-b border-border bg-background pb-4 pt-2">
    <div>
      <h1 className="mb-1 text-5xl font-bold text-accent tracking-tighter">Pipeline</h1>
      <p className="text-sm text-muted">Vue kanban de tes opportunités</p>
    </div>
    <DailyVerse />
  </div>
  <PipelineBoard leads={leads} />
</div>
  );
}