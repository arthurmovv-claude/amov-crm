# Déployer le CRM A.mov

## 1. Créer le projet Supabase

1. Va sur https://supabase.com, crée un nouveau projet (gratuit).
2. Une fois le projet prêt, ouvre l'onglet **SQL Editor** et colle le contenu de `supabase/schema.sql`, puis exécute-le. Ça crée la table `leads`.
3. Va dans **Project Settings > API** et note :
   - `Project URL` → variable `SUPABASE_URL`
   - `service_role` key (⚠️ pas la clé `anon` — la `service_role`, secrète) → variable `SUPABASE_SERVICE_ROLE_KEY`

## 2. Pousser le code sur GitHub

```bash
cd amov-crm
git init
git add .
git commit -m "Initial commit — CRM A.mov"
gh repo create amov-crm --private --source=. --push
# (ou crée le repo sur github.com et fais git remote add origin ... && git push)
```

## 3. Déployer sur Vercel

Comme tu as déjà un compte Vercel :

1. Sur vercel.com, "Add New > Project", importe le repo `amov-crm`.
2. Dans les **Environment Variables**, ajoute :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RELANCE_API_TOKEN` — choisis une chaîne longue et aléatoire (ex: génère avec `openssl rand -hex 32`), c'est le "mot de passe" qui protège la route de notification.
3. Déploie. Tu obtiens une URL du type `https://amov-crm.vercel.app`.

## 4. Vérifier que ça marche

Ouvre l'URL déployée : tu dois voir le Dashboard avec l'état vide "Bienvenue dans ton CRM". Crée un lead de test, vérifie qu'il apparaît dans Leads et Pipeline.

Teste la route de notification :

```
https://amov-crm.vercel.app/api/relances-today?token=TON_RELANCE_API_TOKEN
```

Tu dois recevoir un JSON avec `en_retard` et `aujourdhui`.

## 5. Brancher la tâche programmée Cowork

Dans Cowork, crée une tâche programmée (quotidienne, par exemple 8h) avec un prompt du type :

> Appelle `https://amov-crm.vercel.app/api/relances-today?token=TON_RELANCE_API_TOKEN`.
> Si `total` > 0, envoie-moi un message clair listant les prospects à relancer aujourd'hui
> (nom, entreprise, canal) triés : d'abord ceux en retard, puis ceux du jour.
> Si `total` = 0, ne m'envoie rien.

Assure-toi d'avoir l'appli Cowork sur ton téléphone avec les notifications activées pour recevoir le push.

## Sécurité — pourquoi c'est pensé ainsi

- La clé `service_role` Supabase n'est **jamais** exposée au navigateur : toutes les requêtes DB passent par des Server Components / Server Actions côté serveur Next.js.
- La Row Level Security est activée sur `leads` sans policy publique : impossible de lire/écrire depuis le client, seul le serveur (via `service_role`, qui contourne RLS) le peut.
- La route `/api/relances-today` est protégée par un token statique — pense à le garder secret, ne le partage pas dans un message public.

## Prochaine étape possible (non incluse dans cette v1)

L'intégration Google Agenda (bouton "Connecter à Google Agenda") demande un flow OAuth complet côté Google Cloud Console — volontairement mise de côté pour garder cette v1 simple. Dis-moi si tu veux qu'on l'ajoute une fois que l'outil aura fait ses preuves.
