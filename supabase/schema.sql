-- Schéma du CRM A.mov — à exécuter dans l'éditeur SQL de Supabase

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  entreprise text,
  email text,
  handle text,
  canal text not null check (canal in ('Instagram', 'LinkedIn', 'Email')),
  niche text,
  statut text not null default 'Nouveau' check (statut in
    ('Nouveau', 'Contacté', 'Répondu', 'Appel planifié', 'Offre envoyée', 'Gagné', 'Perdu')),
  priorite text not null default 'Moyenne' check (priorite in ('Faible', 'Moyenne', 'Haute')),
  detail_personnalisation text,
  notes text,
  date_contact_initial date,
  date_derniere_action date,
  date_prochaine_relance date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_statut_idx on leads (statut);
create index if not exists leads_relance_idx on leads (date_prochaine_relance);

-- Met à jour updated_at automatiquement
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_leads_updated_at on leads;
create trigger trg_leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- RLS activé sans policy : personne ne peut lire/écrire via la clé publique
-- (anon). Seul le serveur Next.js, via la clé service_role (qui contourne
-- RLS), peut accéder à la table. C'est volontaire : l'app ne fait aucun appel
-- Supabase depuis le navigateur.
alter table leads enable row level security;
