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
      <div className="flex items-center justify-between px-6 py-3">
  <Link href="/" className="flex items-center gap-3">
    <Image
      src="/logo-transparent.png"
      alt="A.mov"
      width={505}
      height={144}
      style={{ height: "110px", width: "auto", objectFit: "contain" }}
      priority
    />
    <span className="font-[family-name:var(--font-neue-montreal)] font-bold text-4xl tracking-wide text-foreground">
      CRM Arthur
    </span>
  </Link>
  <Link
    href="/leads/new"
    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover"
  >
    <Plus size={16} />
    Nouveau lead
  </Link>
</div>
      <nav className="flex items-center gap-2 px-6 pb-4">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
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
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-lg border border-border p-2 text-muted transition hover:text-foreground">
            <Settings size={16} />
          </span>
        </div>
      </nav>
    </header>
  );
}