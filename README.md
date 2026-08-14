# A.mov CRM

CRM minimaliste pour le suivi de prospection (leads, pipeline, relances), aux couleurs de A.mov Editing.

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres) comme base de données, accédée uniquement côté serveur
- 4 pages : Dashboard, Leads, Pipeline (kanban), Relances
- Route `/api/relances-today` pour brancher une notification quotidienne (voir `DEPLOY.md`)

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local   # puis renseigne tes clés Supabase
npm run dev
```

## Déployer

Voir `DEPLOY.md` pour la marche à suivre complète (Supabase, Vercel, tâche programmée Cowork).
