"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") setTheme("light");
  }, []);

  function applyTheme(next: "dark" | "light") {
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("theme-light", next === "light");
  }

  const btnClass = (active: boolean) =>
    `flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition ${
      active ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:text-foreground"
    }`;

  return (
    <div>
      <p className="mb-2 text-xs font-bold text-muted">Apparence</p>
      <div className="flex gap-2">
        <button onClick={() => applyTheme("dark")} className={btnClass(theme === "dark")}>
          <Moon size={16} />
          Sombre
        </button>
        <button onClick={() => applyTheme("light")} className={btnClass(theme === "light")}>
          <Sun size={16} />
          Clair
        </button>
      </div>
    </div>
  );
}