import LeadForm from "@/components/LeadForm";

export default function NewLeadPage() {
  return (
    <div>
      <h1 className="mb-1 text-5xl font-bold text-accent tracking-tighter">Nouveau lead</h1>
      <p className="mb-6 text-sm text-muted">Ajoute un prospect à ton pipeline.</p>
      <LeadForm />
    </div>
  );
}
