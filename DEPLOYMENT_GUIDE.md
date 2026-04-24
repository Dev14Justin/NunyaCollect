# 🚀 Guide de Déploiement : NunyaCollect

Ce guide vous explique comment déployer l'application **NunyaCollect** en utilisant **Supabase** (Base de données) et **Vercel** (Hébergement Application).

---

## 🏗️ Étape 1 : Préparer la Base de Données (Supabase)

1. **Créer un projet** : Allez sur [supabase.com](https://supabase.com/) et créez un nouveau projet.
2. **Récupérer les chaînes de connexion** :
   - Allez dans **Project Settings** > **Database**.
   - Cherchez la section **Connection string**.
   - Copiez l'URL en mode **Transaction** (Port 6543) : ce sera votre `DATABASE_URL`.
   - Copiez l'URL en mode **Session** (Port 5432) : ce sera votre `DIRECT_URL`.
3. **Mot de passe** : N'oubliez pas de remplacer `[YOUR-PASSWORD]` dans les URLs par le mot de passe que vous avez choisi à la création du projet.

---

## 🔐 Étape 2 : Variables d'Environnement

Préparez les variables suivantes pour Vercel :

| Variable | Valeur / Source |
| :--- | :--- |
| `DATABASE_URL` | L'URL Supabase (Port 6543) avec `?pgbouncer=true` à la fin. |
| `DIRECT_URL` | L'URL Supabase (Port 5432). |
| `AUTH_SECRET` | Une chaîne aléatoire très longue (ex: générée via `openssl rand -base64 32`). |
| `NEXTAUTH_URL` | L'adresse de votre site Vercel (ex: `https://nunya-collect.vercel.app`). |

---

## 📦 Étape 3 : Déploiement sur Vercel

1. **Lier GitHub** : Connectez votre compte GitHub à Vercel.
2. **Importer** : Choisissez le dépôt `NunyaCollect`.
3. **Configuration** :
   - **Framework Preset** : Next.js.
   - **Root Directory** : `nunyacollect`.
   - **Environment Variables** : Ajoutez toutes les variables listées à l'étape 2.
4. **Déployer** : Cliquez sur le bouton **Deploy**.

---

## ⚡ Étape 4 : Initialiser la Base de Données Réelle

Une fois que vous avez configuré votre fichier `.env` local avec les URLs Supabase (ou que vous avez installé la CLI Vercel), lancez cette commande pour créer les tables sur Supabase :

```bash
npx prisma db push
```

*Note : Cette commande va lire votre schéma Prisma et créer toutes les tables (Clients, Transactions, Utilisateurs, etc.) sur votre serveur en ligne.*

---

## 🛠️ Maintenance & Commandes Utiles

- **Mettre à jour la base** : Si vous modifiez le fichier `schema.prisma`, relancez `npx prisma db push`.
- **Voir les données** : Vous pouvez utiliser `npx prisma studio` en local (en étant connecté à Supabase) ou utiliser l'interface de Supabase directement.
- **Vérifier les logs** : Sur Vercel, allez dans l'onglet **Logs** pour voir les erreurs en temps réel si quelque chose ne fonctionne pas.

---

## 🎨 Rappel Identité Visuelle
L'application est configurée pour un design **Flat High Contrast**.
- **Couleurs** : Slate (Ardoise) & Emerald (Émeraude).
- **Icons** : Lucide React.
- **Middleware** : Désormais configuré en `proxy.ts` pour Next.js 16.

---
*Guide généré par Antigravity - Prêt pour la mise en production.*
