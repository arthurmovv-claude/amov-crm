import ImportLeadsForm from "@/components/ImportLeadsForm";

export default function ImportLeadsPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Importer des leads</h1>
      <p className="mb-6 text-sm text-muted">Colle une liste de prospects trouvés pendant une session de sourcing.</p>
      <ImportLeadsForm />
    </div>
  );
}