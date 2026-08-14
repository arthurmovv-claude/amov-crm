import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client SERVEUR UNIQUEMENT : utilise la clé service_role, jamais exposée au
// navigateur (pas de préfixe NEXT_PUBLIC_). N'importer ce fichier que depuis
// des Server Components, Server Actions ou Route Handlers.
//
// Instanciation paresseuse : évite qu'une variable d'env manquante fasse
// planter la build/l'analyse statique de Next.js avant même qu'une requête
// ne soit faite. L'erreur ne se déclenche que si le client est réellement
// utilisé sans les variables configurées.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies (voir .env.local.example)."
    );
  }

  client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
  return client;
}
