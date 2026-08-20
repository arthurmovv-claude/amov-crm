import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-accent tracking-tight">Réglages</h1>
      <p className="mb-6 text-sm text-muted">Préférences d&apos;affichage du CRM.</p>
      <div className="max-w-sm rounded-lg border border-border bg-surface p-4">
        <ThemeToggle />
      </div>
    </div>
  );
}