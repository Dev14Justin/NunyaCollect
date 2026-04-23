# 🟢 NunyaCollect — Plateforme de Micro-Finance

NunyaCollect est une application Full-Stack moderne conçue pour digitaliser, tracer et sécuriser la collecte d'épargne sur les marchés en temps réel. Elle permet une collaboration fluide entre les **collectrices sur le terrain** (via une interface mobile) et les **administrateurs** (via un dashboard analytique avec cartographie).

---

## 🛠 Stack Technique

- **Framework** : [Next.js 16 (App Router)](https://nextjs.org/)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL via [Prisma ORM (v6)](https://www.prisma.io/)
- **Authentification** : [Auth.js v5 (NextAuth)](https://authjs.dev/)
- **Style** : Tailwind CSS v4 (Design Premium / Glassmorphism)
- **Cartographie** : Leaflet.js
- **Analytiques** : Recharts
- **Infrastructure** : Docker (PostgreSQL & Redis)

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v20 ou plus récent)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

## 🚀 Installation et Démarrage

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd nunyacollect
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Copiez le fichier d'exemple et remplissez les variables nécessaires :
```bash
cp .env.example .env
```

### 4. Lancer l'infrastructure (Docker)
Lancez la base de données et le serveur Redis :
```bash
docker-compose up -d
```

### 5. Préparer la base de données
Synchronisez le schéma Prisma et remplissez les données de test (Seed) :
```bash
npx prisma db push
npx prisma db seed
```

### 6. Lancer le serveur de développement
```bash
npm run dev
```
L'application est maintenant accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🏗 Structure du Projet

- `app/` : Routes et pages (Next.js App Router).
  - `(auth)/` : Pages de connexion et sécurité.
  - `(dashboard)/` : Interface d'administration.
  - `(collectrice)/` : Interface mobile pour le terrain.
- `components/` : Composants UI réutilisables (Layout, Carte, Graphiques).
- `hooks/` : Logique React personnalisée (ex: `useGeolocation`).
- `lib/` : Configurations (Prisma, Auth.js, Utils).
- `prisma/` : Schéma de données et scripts de migration.
- `public/` : Assets statiques (Images, Icônes).

---

## 🤝 Guide de Collaboration (Git Workflow)

Pour maintenir un code propre et stable, nous suivons le flux de travail suivant :

### 1. Branches
- `main` : Branche de production (stable uniquement).
- `develop` : Branche d'intégration (fonctionnalités testées).
- `feature/...` : Pour chaque nouvelle fonctionnalité (ex: `feature/rapport-pdf`).
- `fix/...` : Pour les corrections de bugs (ex: `fix/gps-precision`).

### 2. Workflow
1. Toujours partir de la branche `develop` pour créer une nouvelle branche.
2. Faire des commits explicites (ex: `feat: add real-time map markers`).
3. **Push** vers le repo distant.
4. Ouvrir une **Pull Request (PR)** vers `develop`.
5. Attendre la revue d'au moins un autre développeur avant le merge.

---

## 🔐 Identifiants de Test (Mode Développement)

Après avoir lancé le `npx prisma db seed`, vous pouvez utiliser :

- **Admin** : `admin@nunyacollect.com` / `Admin123!`
- **Collectrice** : `collectrice1@test.com` / `Admin123!`

---

## 📌 Commandes Utiles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur local |
| `npx prisma studio` | Interface graphique pour explorer la base de données |
| `npx prisma generate` | Regénère le client Prisma après un changement de schéma |
| `docker-compose stop` | Arrête la base de données sans supprimer les données |

---

## 🛡 Sécurité et Bonnes Pratiques
- **Secrets** : Ne jamais pusher le fichier `.env` sur le dépôt.
- **Rôles (RBAC)** : Toujours vérifier le rôle de l'utilisateur dans le `middleware.ts` et les routes API.
- **GPS** : La position est capturée automatiquement, assurez-vous de gérer les permissions navigateur.

---
© 2026 NunyaCollect — Propulsé par le futur de la Micro-Finance.
