export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getLead } from "@/lib/data";
import LeadForm from "@/components/LeadForm";

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <div>
      <h1 className="mb-1 text-5xl font-bold text-accent tracking-tighter">Modifier le lead</h1>
      <p className="mb-6 text-sm text-muted">{lead.nom}</p>
      <LeadForm lead={lead} />
    </div>
  );
}
