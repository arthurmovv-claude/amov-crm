"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bulkImportLeadsAction } from "@/app/actions";

export default function ImportLeadsForm() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{ imported: number; skipped: number[] } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    const formData = new FormData();
    formData.set("data", value);
    startTransition(async () => {
      const res = await bulkImportLeadsAction(formData);
      setResult(res);
      if (res.imported > 0) setValue("");
    });
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Une ligne par prospect, format :{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-xs">Nom, handle ou email, canal, niche</code>. Le
        canal (Instagram / LinkedIn / Email) et la niche sont optionnels — Instagram par défaut.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={12}
        placeholder={"Margot Petit, @margotfit, Instagram, Fitness\nJules Dubois, jules@dubois.co, Email, SaaS"}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
      />
      <button
        onClick={handleSubmit}
        disabled={isPending || !value.trim()}
        className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
      >
        {isPending ? "Import en cours..." : "Importer"}
      </button>

      {result && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-3 text-sm">
          <p className="font-bold text-foreground">
            {result.imported} lead{result.imported > 1 ? "s" : ""} importé{result.imported > 1 ? "s" : ""}.
          </p>
          {result.skipped.length > 0 && (
            <p className="mt-1 text-muted">
              Ligne{result.skipped.length > 1 ? "s" : ""} ignorée{result.skipped.length > 1 ? "s" : ""} (nom
              manquant) : {result.skipped.join(", ")}
            </p>
          )}
          {result.imported > 0 && (
            <button
              onClick={() => router.push("/leads")}
              className="mt-2 text-xs font-bold text-accent hover:underline"
            >
              Voir les leads →
            </button>
          )}
        </div>
      )}
    </div>
  );
}