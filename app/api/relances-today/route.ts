import { NextRequest, NextResponse } from "next/server";
import { getRelances, autoCloseStaleLeads } from "@/lib/data";

// Route appelée par la tâche programmée Cowork (une fois par jour).
// Protégée par un token statique : ?token=... ou header Authorization: Bearer ...
export async function GET(req: NextRequest) {
  const token = process.env.RELANCE_API_TOKEN;
  const provided =
    req.nextUrl.searchParams.get("token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token || provided !== token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Clôture automatique : leads "Contacté" sans réponse depuis 14 jours → "Perdu".
  const { closed } = await autoCloseStaleLeads(14);

  const { enRetard, aujourdhui } = await getRelances();

  const format = (l: Awaited<ReturnType<typeof getRelances>>["enRetard"][number]) => ({
    nom: l.nom,
    entreprise: l.entreprise,
    canal: l.canal,
    statut: l.statut,
    date_prochaine_relance: l.date_prochaine_relance,
    lien: `/leads/${l.id}/edit`,
  });

  return NextResponse.json({
    date: new Date().toISOString().slice(0, 10),
    total: enRetard.length + aujourdhui.length,
    en_retard: enRetard.map(format),
    aujourdhui: aujourdhui.map(format),
    auto_clotures: closed,
  });
}