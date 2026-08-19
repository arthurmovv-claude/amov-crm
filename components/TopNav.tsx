"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Kanban, Bell, Settings, Plus } from "lucide-react";

const TABS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/relances", label: "Relances", icon: Bell },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/logo-transparent.png"
            alt="A.mov"
            width={160}
            height={64}
            className="shrink-0 object-contain"
            style={{ height: "clamp(36px, 10vw, 72px)", width: "auto" }}
            priority
          />
          <span
  className="truncate font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-foreground sm:text-2xl"
  style={{ textShadow: "0 0 12px rgba(212, 43, 43, 0.55)" }}
>
  CRM Arthur.mov
</span>
        </Link>
        <Link
          href="/leads/new"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white transition hover:bg-accent-hover sm:px-4"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nouveau lead</span>
        </Link>
      </div>
      <nav
        className="flex items-center gap-2 overflow-x-auto px-4 pb-4 sm:px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          );
        })}
        <div className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          <Link
            href="/settings"
            className="rounded-lg border border-border p-2 text-muted transition hover:text-foreground"
          >
            <Settings size={16} />
          </Link>
        </div>
      </nav>
    </header>
  );
}