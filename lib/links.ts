import type { Lead } from "./types";

// Construit un lien vers le profil du prospect à partir du canal + handle.
// Si "handle" contient déjà une URL complète (collée telle quelle), on la garde.
export function buildProfileUrl(lead: Lead): string | null {
  const handle = lead.handle?.trim();
  if (!handle) return null;
  if (handle.startsWith("http://") || handle.startsWith("https://")) return handle;

  const clean = handle.replace(/^@/, "");
  if (lead.canal === "Instagram") return `https://www.instagram.com/${clean}/`;
  if (lead.canal === "LinkedIn") return `https://www.linkedin.com/in/${clean}/`;
  return null;
}