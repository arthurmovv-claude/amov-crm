"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ScheduleCallModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (isoDateTime: string) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleConfirm() {
    if (!date) return;
    const iso = new Date(`${date}T${time || "00:00"}`).toISOString();
    onConfirm(iso);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold">Planifier l&apos;appel</h2>
          <button onClick={onCancel} className="text-muted hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted">Heure</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!date}
            className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            Confirmer
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted transition hover:text-foreground"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}