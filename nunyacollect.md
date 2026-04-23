# NunyaCollect — Plateforme de Suivi des Collectrices de Fonds

> **Digitaliser, tracer et sécuriser la collecte d'épargne sur les marchés en temps réel.**

---

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture globale](#2-architecture-globale)
3. [Stack technique](#3-stack-technique)
4. [Structure des dossiers](#4-structure-des-dossiers)
5. [Modèle de données (PostgreSQL)](#5-modèle-de-données-postgresql)
6. [Fonctionnalités détaillées](#6-fonctionnalités-détaillées)
7. [API Routes (Next.js)](#7-api-routes-nextjs)
8. [Authentification & Rôles](#8-authentification--rôles)
9. [Géolocalisation & Temps Réel](#9-géolocalisation--temps-réel)
10. [Système d'alertes & Détection d'anomalies](#10-système-dalertes--détection-danomalies)
11. [Rapports & Exports](#11-rapports--exports)
12. [Interfaces utilisateur (UI/UX)](#12-interfaces-utilisateur-uiux)
13. [Variables d'environnement](#13-variables-denvironnement)
14. [Installation & Démarrage](#14-installation--démarrage)
15. [Déploiement](#15-déploiement)
16. [Sécurité](#16-sécurité)
17. [Roadmap](#17-roadmap)

---

## 1. Vue d'ensemble du projet

### Contexte

Les sociétés de micro-finance emploient des **collectrices de fonds** qui se déplacent physiquement sur les marchés pour récupérer l'épargne de leurs clients. Aujourd'hui, tout ce processus repose sur des supports manuels (carnets, reçus papier), engendrant des risques majeurs : perte de données, erreurs de saisie, détournements de fonds, aucun suivi en temps réel.

### Objectif

**NunyaCollect** est une plateforme web full-stack qui permet à une société de micro-finance de :

- **Géolocaliser en temps réel** chaque collectrice sur une carte interactive
- **Enregistrer chaque transaction** (montant, client, heure, coordonnées GPS) depuis le mobile de la collectrice
- **Suivre les itinéraires** parcourus par chaque collectrice durant sa journée
- **Générer des rapports automatiques** quotidiens, hebdomadaires et mensuels
- **Détecter et alerter** sur les anomalies (zones inhabituelles, transactions suspectes, inactivité prolongée)
- **Gérer l'ensemble des acteurs** : admin, superviseurs, collectrices, clients

### Utilisateurs cibles

| Rôle | Description |
|------|-------------|
| **Super Admin** | Directeur technique / DSI de la micro-finance. Accès total. |
| **Admin** | Gestionnaire / responsable d'agence. Tableau de bord, rapports, alertes. |
| **Superviseur** | Responsable d'équipe. Suivi de ses collectrices assignées. |
| **Collectrice** | Agente terrain. Interface mobile pour enregistrer les transactions. |
| **Client** | Épargnant. Pas d'accès direct à la plateforme (futur : portail client). |

---

## 2. Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser/Mobile)                  │
│  ┌─────────────────────┐    ┌──────────────────────────────┐   │
│  │  Dashboard Admin     │    │  Interface Collectrice        │   │
│  │  (Next.js App Router)│    │  (Next.js PWA - Mobile First) │   │
│  └──────────┬──────────┘    └──────────────┬───────────────┘   │
└─────────────┼──────────────────────────────┼───────────────────┘
              │ HTTPS / WebSocket             │ HTTPS / WebSocket
┌─────────────▼──────────────────────────────▼───────────────────┐
│                    NEXT.JS SERVER (App Router)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes (/api/*)                                      │  │
│  │  - Auth (NextAuth.js)                                     │  │
│  │  - Transactions CRUD                                      │  │
│  │  - Géolocalisation (positions)                            │  │
│  │  - Alertes & Anomalies                                    │  │
│  │  - Rapports & Exports                                     │  │
│  │  - WebSocket Server (Socket.io / Pusher)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Server Actions & Middleware                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                         COUCHE DONNÉES                          │
│  ┌──────────────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │   PostgreSQL DB   │  │  Redis Cache │  │  Stockage Fichiers│ │
│  │  (Neon / Supabase)│  │  (Upstash)   │  │  (AWS S3 / Vercel)│ │
│  └──────────────────┘  └──────────────┘  └───────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      SERVICES EXTERNES                          │
│  ┌─────────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │  Mapbox / Leaflet│  │  Resend /   │  │  Twilio / Africa's │  │
│  │  (Cartes)        │  │  Nodemailer │  │  Talking (SMS)     │  │
│  └─────────────────┘  └─────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Stack technique

### Core

| Technologie | Usage | Version recommandée |
|-------------|-------|---------------------|
| **Next.js** | Framework full-stack (App Router) | `^14.x` |
| **TypeScript** | Typage statique | `^5.x` |
| **PostgreSQL** | Base de données relationnelle | `^16.x` |
| **Prisma ORM** | Modélisation et accès à la base de données | `^5.x` |
| **NextAuth.js (Auth.js)** | Authentification, sessions, JWT | `^5.x` |

### UI & Frontend

| Bibliothèque | Usage |
|-------------|-------|
| **Tailwind CSS** | Styling utilitaire |
| **shadcn/ui** | Composants UI accessibles et stylisés |
| **Lucide React** | Icônes |
| **Framer Motion** | Animations |
| **React Hook Form** | Gestion des formulaires |
| **Zod** | Validation des schémas côté client et serveur |
| **TanStack Query (React Query)** | Gestion du cache et des requêtes async |
| **Recharts** | Graphiques et visualisations de données |
| **React Hot Toast / Sonner** | Notifications toast |

### Cartographie & Géolocalisation

| Bibliothèque | Usage |
|-------------|-------|
| **Leaflet.js + React-Leaflet** | Carte interactive open-source (gratuit) |
| **OpenStreetMap** | Tuiles cartographiques (gratuit) |
| **Mapbox GL JS** | Alternative premium (meilleure qualité visuelle) |
| **Browser Geolocation API** | Récupération GPS côté collectrice |

### Temps réel

| Bibliothèque | Usage |
|-------------|-------|
| **Pusher / Ably** | WebSockets managés (simple à déployer) |
| **Socket.io** | Alternative si auto-hébergé |

### Backend & Base de données

| Bibliothèque | Usage |
|-------------|-------|
| **Prisma Client** | ORM queries |
| **Neon / Supabase** | PostgreSQL serverless hébergé |
| **Upstash Redis** | Cache, rate-limiting, sessions temps réel |
| **bcryptjs** | Hachage de mots de passe |
| **Jose** | JWT encoding/decoding |

### Rapports & Exports

| Bibliothèque | Usage |
|-------------|-------|
| **@react-pdf/renderer** | Génération de PDF côté serveur |
| **xlsx (SheetJS)** | Export Excel |
| **date-fns** | Manipulation des dates |
| **Resend** | Envoi d'emails transactionnels |

### Outils de développement

| Outil | Usage |
|-------|-------|
| **ESLint + Prettier** | Linting et formatage |
| **Husky + lint-staged** | Pre-commit hooks |
| **Jest + Testing Library** | Tests unitaires |
| **Playwright** | Tests E2E |
| **Docker + docker-compose** | Environnement de développement local |

---

## 4. Structure des dossiers

```
nunyacollect/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Groupe de routes - authentification
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  # Groupe de routes - admin/superviseur
│   │   ├── layout.tsx                # Layout avec sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Vue d'ensemble temps réel
│   │   ├── collectrices/
│   │   │   ├── page.tsx              # Liste des collectrices
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Détail d'une collectrice
│   │   ├── transactions/
│   │   │   ├── page.tsx              # Toutes les transactions
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Détail transaction
│   │   ├── carte/
│   │   │   └── page.tsx              # Carte temps réel
│   │   ├── clients/
│   │   │   ├── page.tsx              # Liste clients
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Fiche client + historique
│   │   ├── rapports/
│   │   │   └── page.tsx              # Génération de rapports
│   │   ├── alertes/
│   │   │   └── page.tsx              # Centre d'alertes
│   │   └── parametres/
│   │       └── page.tsx              # Configuration
│   │
│   ├── (collectrice)/                # Groupe de routes - interface collectrice (mobile)
│   │   ├── layout.tsx
│   │   ├── accueil/
│   │   │   └── page.tsx              # Page d'accueil collectrice
│   │   ├── nouvelle-transaction/
│   │   │   └── page.tsx              # Formulaire nouvelle transaction
│   │   └── mes-transactions/
│   │       └── page.tsx              # Historique du jour
│   │
│   └── api/                          # API Routes
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts
│       ├── transactions/
│       │   ├── route.ts              # GET (liste) / POST (créer)
│       │   └── [id]/
│       │       └── route.ts          # GET / PUT / DELETE
│       ├── collectrices/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── positions/
│       │   └── route.ts              # POST position GPS (temps réel)
│       ├── clients/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── alertes/
│       │   └── route.ts
│       └── rapports/
│           ├── quotidien/
│           │   └── route.ts
│           ├── export-pdf/
│           │   └── route.ts
│           └── export-excel/
│               └── route.ts
│
├── components/                       # Composants réutilisables
│   ├── ui/                           # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileNav.tsx
│   ├── carte/
│   │   ├── CarteTempsReel.tsx        # Carte principale Leaflet
│   │   ├── MarqueurCollectrice.tsx
│   │   └── HistoriqueItineraire.tsx
│   ├── transactions/
│   │   ├── FormulaireTransaction.tsx
│   │   ├── TableauTransactions.tsx
│   │   └── CarteTransaction.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── GraphiqueJournalier.tsx
│   │   └── AlertesBanner.tsx
│   └── rapports/
│       └── GenerateurRapport.tsx
│
├── lib/                              # Utilitaires et configurations
│   ├── prisma.ts                     # Client Prisma singleton
│   ├── auth.ts                       # Configuration NextAuth
│   ├── pusher.ts                     # Client Pusher
│   ├── redis.ts                      # Client Redis
│   ├── anomalies.ts                  # Logique de détection d'anomalies
│   ├── rapports.ts                   # Génération de rapports
│   └── utils.ts                      # Fonctions utilitaires
│
├── hooks/                            # React custom hooks
│   ├── useGeolocation.ts
│   ├── useCollectricesTempsReel.ts
│   └── useAlertes.ts
│
├── types/                            # Types TypeScript globaux
│   └── index.ts
│
├── prisma/
│   ├── schema.prisma                 # Schéma de la base de données
│   ├── migrations/                   # Historique des migrations
│   └── seed.ts                       # Données de test
│
├── middleware.ts                     # Middleware Next.js (auth, RBAC)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                        # Variables d'environnement (ne pas commit)
├── .env.example                      # Template des variables d'environnement
└── docker-compose.yml                # PostgreSQL + Redis local
```

---

## 5. Modèle de données (PostgreSQL)

### Schéma Prisma complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUM TYPES
// ─────────────────────────────────────────────

enum Role {
  SUPER_ADMIN
  ADMIN
  SUPERVISEUR
  COLLECTRICE
}

enum StatutTransaction {
  EN_ATTENTE
  CONFIRMEE
  ANNULEE
  SUSPECTE
}

enum TypeTransaction {
  DEPOT
  RETRAIT
  REMBOURSEMENT
}

enum NiveauAlerte {
  INFO
  AVERTISSEMENT
  CRITIQUE
}

enum TypeAlerte {
  ZONE_INHABITUELLE
  TRANSACTION_SUSPECTE
  INACTIVITE_PROLONGEE
  MONTANT_ELEVE
  HORS_HORAIRE
  ECART_RAPPORT
}

enum StatutCollectrice {
  ACTIVE
  INACTIVE
  SUSPENDUE
}

// ─────────────────────────────────────────────
// TABLE : Organisations (Multi-tenant)
// ─────────────────────────────────────────────

model Organisation {
  id          String   @id @default(cuid())
  nom         String
  code        String   @unique
  telephone   String?
  email       String?
  adresse     String?
  logo        String?  // URL logo
  actif       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  utilisateurs Utilisateur[]
  clients      Client[]
  zones        Zone[]
  parametres   Parametres?

  @@map("organisations")
}

// ─────────────────────────────────────────────
// TABLE : Utilisateurs (tous rôles)
// ─────────────────────────────────────────────

model Utilisateur {
  id              String            @id @default(cuid())
  nom             String
  prenom          String
  email           String            @unique
  telephone       String?
  motDePasse      String            // bcrypt hash
  role            Role
  statut          StatutCollectrice @default(ACTIVE)
  photo           String?           // URL photo de profil
  organisationId  String
  superviseurId   String?           // Pour les collectrices, leur superviseur
  zoneId          String?           // Zone géographique assignée
  dernierLogin    DateTime?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  organisation   Organisation  @relation(fields: [organisationId], references: [id])
  superviseur    Utilisateur?  @relation("SupervisionHierarchie", fields: [superviseurId], references: [id])
  subalternes    Utilisateur[] @relation("SupervisionHierarchie")
  zone           Zone?         @relation(fields: [zoneId], references: [id])

  // Relations collectrice
  transactions   Transaction[]
  positions      PositionGPS[]
  alertes        Alerte[]
  rapports       Rapport[]
  sessions       Session[]

  @@map("utilisateurs")
}

// ─────────────────────────────────────────────
// TABLE : Sessions (NextAuth)
// ─────────────────────────────────────────────

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  utilisateurId String
  expires      DateTime

  utilisateur Utilisateur @relation(fields: [utilisateurId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ─────────────────────────────────────────────
// TABLE : Clients (épargnants)
// ─────────────────────────────────────────────

model Client {
  id              String   @id @default(cuid())
  nom             String
  prenom          String
  telephone       String
  numeroCarte     String   @unique  // Numéro de carte client
  adresse         String?
  photo           String?
  organisationId  String
  collectriceId   String?  // Collectrice habituellement assignée
  solde           Decimal  @default(0) @db.Decimal(15, 2)
  actif           Boolean  @default(true)
  dateInscription DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organisation Organisation  @relation(fields: [organisationId], references: [id])
  transactions Transaction[]

  @@map("clients")
}

// ─────────────────────────────────────────────
// TABLE : Transactions
// ─────────────────────────────────────────────

model Transaction {
  id              String            @id @default(cuid())
  montant         Decimal           @db.Decimal(15, 2)
  type            TypeTransaction   @default(DEPOT)
  statut          StatutTransaction @default(EN_ATTENTE)
  clientId        String
  collectriceId   String
  latitude        Float?            // Coordonnées GPS au moment de la transaction
  longitude       Float?
  adresseApprox   String?           // Adresse approximative reverse-geocodée
  note            String?           // Note de la collectrice
  photoRecu       String?           // URL photo du reçu (optionnel)
  numeroRecu      String            @unique @default(cuid())
  confirmeePar    String?           // ID de l'admin qui a confirmé
  dateTransaction DateTime          @default(now())
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  client      Client      @relation(fields: [clientId], references: [id])
  collectrice Utilisateur @relation(fields: [collectriceId], references: [id])
  alertes     Alerte[]

  @@map("transactions")
}

// ─────────────────────────────────────────────
// TABLE : Positions GPS (historique temps réel)
// ─────────────────────────────────────────────

model PositionGPS {
  id            String   @id @default(cuid())
  collectriceId String
  latitude      Float
  longitude     Float
  precision     Float?   // Précision GPS en mètres
  vitesse       Float?   // Vitesse en km/h
  cap           Float?   // Direction (bearing)
  timestamp     DateTime @default(now())

  collectrice Utilisateur @relation(fields: [collectriceId], references: [id])

  @@index([collectriceId, timestamp])
  @@map("positions_gps")
}

// ─────────────────────────────────────────────
// TABLE : Zones géographiques
// ─────────────────────────────────────────────

model Zone {
  id             String   @id @default(cuid())
  nom            String
  description    String?
  organisationId String
  // GeoJSON polygon (zone définie sur la carte)
  polygone       Json?    // { type: "Polygon", coordinates: [...] }
  centre         Json?    // { latitude: x, longitude: y }
  rayon          Float?   // Rayon en km si zone circulaire
  actif          Boolean  @default(true)
  createdAt      DateTime @default(now())

  organisation  Organisation  @relation(fields: [organisationId], references: [id])
  utilisateurs  Utilisateur[]
  alertes       Alerte[]

  @@map("zones")
}

// ─────────────────────────────────────────────
// TABLE : Alertes
// ─────────────────────────────────────────────

model Alerte {
  id            String       @id @default(cuid())
  type          TypeAlerte
  niveau        NiveauAlerte @default(AVERTISSEMENT)
  message       String
  collectriceId String
  transactionId String?
  zoneId        String?
  latitude      Float?
  longitude     Float?
  lue           Boolean      @default(false)
  resolue       Boolean      @default(false)
  resolueParId  String?
  resolueAt     DateTime?
  createdAt     DateTime     @default(now())

  collectrice  Utilisateur  @relation(fields: [collectriceId], references: [id])
  transaction  Transaction? @relation(fields: [transactionId], references: [id])
  zone         Zone?        @relation(fields: [zoneId], references: [id])

  @@index([collectriceId, createdAt])
  @@map("alertes")
}

// ─────────────────────────────────────────────
// TABLE : Rapports
// ─────────────────────────────────────────────

model Rapport {
  id            String   @id @default(cuid())
  titre         String
  type          String   // "QUOTIDIEN" | "HEBDOMADAIRE" | "MENSUEL" | "PERSONNALISE"
  dateDebut     DateTime
  dateFin       DateTime
  genereParId   String
  urlPdf        String?  // Lien vers le PDF stocké
  urlExcel      String?
  donnees       Json     // Snapshot JSON des données du rapport
  createdAt     DateTime @default(now())

  generePar Utilisateur @relation(fields: [genereParId], references: [id])

  @@map("rapports")
}

// ─────────────────────────────────────────────
// TABLE : Paramètres organisation
// ─────────────────────────────────────────────

model Parametres {
  id                    String  @id @default(cuid())
  organisationId        String  @unique
  montantMaxTransaction Decimal @default(500000) @db.Decimal(15, 2)
  heureDebutActivite    String  @default("07:00")
  heureFinActivite      String  @default("19:00")
  distanceMaxZone       Float   @default(5.0)  // km
  inactiviteSeuilMin    Int     @default(60)   // minutes sans position = alerte
  seuilMontantEleve     Decimal @default(200000) @db.Decimal(15, 2)

  organisation Organisation @relation(fields: [organisationId], references: [id])

  @@map("parametres")
}
```

---

## 6. Fonctionnalités détaillées

### 6.1 Authentification & Gestion des comptes

- **Inscription** : Seul le Super Admin peut créer des comptes Admin. Les Admins créent les Superviseurs et les Collectrices.
- **Connexion** : Email + mot de passe. JWT stocké dans un cookie httpOnly.
- **Mot de passe oublié** : Envoi d'un lien de réinitialisation par email (Resend).
- **Première connexion** : La collectrice est forcée de changer son mot de passe temporaire.
- **Profil** : Chaque utilisateur peut modifier ses informations et sa photo.

### 6.2 Tableau de bord Admin (temps réel)

Widgets affichés :

| Widget | Description |
|--------|-------------|
| **Collectrices actives** | Nombre de collectrices sur le terrain en ce moment |
| **Montant collecté aujourd'hui** | Somme totale des transactions du jour |
| **Nombre de transactions** | Count du jour avec variation vs veille |
| **Alertes non résolues** | Badge rouge avec count |
| **Carte temps réel** | Positions live de toutes les collectrices |
| **Graphique des collectes** | Courbe horaire du montant collecté |
| **Top collectrices** | Classement par montant collecté |
| **Transactions récentes** | Feed live des 10 dernières transactions |

### 6.3 Interface Collectrice (Mobile First, PWA)

L'interface collectrice est optimisée pour smartphone :

**Flux d'une journée type :**

1. **Connexion** → Vérification des informations
2. **Démarrage de session** → Activation du partage GPS (consent prompt)
3. **Accueil** → Résumé du jour (objectif, montant collecté, nb transactions)
4. **Nouvelle transaction** :
   - Scanner/saisir le numéro de carte client
   - Rechercher le client par nom/téléphone
   - Saisir le montant
   - Sélectionner le type (dépôt/retrait/remboursement)
   - Ajouter une note optionnelle
   - Photo du reçu (optionnel)
   - **Validation → GPS capturé automatiquement → Envoi serveur**
   - Reçu numérique affiché (partage SMS possible)
5. **Historique du jour** → Liste de ses transactions
6. **Fin de session** → Rapport de clôture automatique

### 6.4 Géolocalisation temps réel

- Toutes les 30 secondes, l'app collectrice envoie la position GPS au serveur via `navigator.geolocation.watchPosition()`
- Les positions sont stockées en base et diffusées en temps réel via Pusher
- La carte admin affiche les marqueurs animés de chaque collectrice
- Clic sur un marqueur → popup avec : photo, nom, dernière transaction, montant du jour
- Historique de l'itinéraire du jour visualisable (polyline sur la carte)

### 6.5 Gestion des clients

- Création de fiche client avec numéro de carte unique (QR code générable)
- Historique complet des transactions par client
- Solde calculé en temps réel
- Assignation d'une collectrice référente
- Recherche rapide par nom, téléphone ou numéro de carte

### 6.6 Gestion des collectrices

- Création et activation/désactivation des comptes
- Assignation à un superviseur et à une zone géographique
- Statistiques individuelles : montant total collecté, nb transactions, jours actifs
- Historique des positions et itinéraires
- Alertes liées à la collectrice

### 6.7 Gestion des zones

- Définition de zones géographiques sur la carte (dessin de polygone)
- Assignation des collectrices à des zones
- Déclenchement d'alertes si une collectrice sort de sa zone assignée

---

## 7. API Routes (Next.js)

### Auth

```
POST   /api/auth/signin              → Connexion
POST   /api/auth/signout             → Déconnexion
POST   /api/auth/reset-password      → Demande réinitialisation
PUT    /api/auth/reset-password/[token] → Nouvelle mot de passe
```

### Transactions

```
GET    /api/transactions             → Liste (filtres: date, collectrice, statut, type)
POST   /api/transactions             → Créer une transaction
GET    /api/transactions/[id]        → Détail
PUT    /api/transactions/[id]        → Modifier (statut, note)
DELETE /api/transactions/[id]        → Annuler
GET    /api/transactions/export      → Export CSV/Excel
```

**Body POST /api/transactions :**
```json
{
  "montant": 15000,
  "type": "DEPOT",
  "clientId": "clj...",
  "latitude": 6.1377,
  "longitude": 1.2123,
  "note": "Collecte marché Assigamé",
  "photoRecu": "data:image/jpeg;base64,..."
}
```

### Collectrices

```
GET    /api/collectrices             → Liste
POST   /api/collectrices             → Créer un compte collectrice
GET    /api/collectrices/[id]        → Détail + stats
PUT    /api/collectrices/[id]        → Modifier
DELETE /api/collectrices/[id]        → Désactiver
GET    /api/collectrices/[id]/positions → Historique GPS du jour
GET    /api/collectrices/[id]/transactions → Transactions d'une collectrice
```

### Positions GPS

```
POST   /api/positions                → Enregistrer position (utilisé par app collectrice)
GET    /api/positions/actives        → Positions actuelles de toutes les collectrices actives
```

**Body POST /api/positions :**
```json
{
  "latitude": 6.1377,
  "longitude": 1.2123,
  "precision": 10.5,
  "vitesse": 3.2,
  "timestamp": "2024-01-15T09:30:00Z"
}
```

### Clients

```
GET    /api/clients                  → Liste (recherche par nom, tel, carte)
POST   /api/clients                  → Créer un client
GET    /api/clients/[id]             → Détail + solde + historique
PUT    /api/clients/[id]             → Modifier
GET    /api/clients/[id]/transactions → Historique transactions
```

### Alertes

```
GET    /api/alertes                  → Liste des alertes (filtres: niveau, type, lue)
PUT    /api/alertes/[id]/lire        → Marquer comme lue
PUT    /api/alertes/[id]/resoudre    → Marquer comme résolue
```

### Rapports

```
GET    /api/rapports/quotidien       → Rapport du jour (ou date spécifiée)
GET    /api/rapports/hebdomadaire    → Rapport hebdomadaire
GET    /api/rapports/mensuel         → Rapport mensuel
POST   /api/rapports/generer         → Générer rapport personnalisé
GET    /api/rapports/export-pdf/[id] → Télécharger PDF
GET    /api/rapports/export-excel/[id] → Télécharger Excel
```

---

## 8. Authentification & Rôles

### Configuration NextAuth (Auth.js v5)

```typescript
// lib/auth.ts
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.utilisateur.findUnique({
          where: { email: credentials.email }
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.motDePasse)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          nom: user.nom,
          role: user.role,
          organisationId: user.organisationId
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.organisationId = user.organisationId
      }
      return token
    },
    session: ({ session, token }) => {
      session.user.role = token.role
      session.user.organisationId = token.organisationId
      return session
    }
  }
}
```

### Middleware RBAC

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")
  
  // Routes protégées par rôle
  const adminRoutes = ["/dashboard", "/collectrices", "/rapports"]
  const collectriceRoutes = ["/accueil", "/nouvelle-transaction"]
  
  // Redirection selon rôle
}
```

### Matrice des permissions

| Action | Super Admin | Admin | Superviseur | Collectrice |
|--------|:-----------:|:-----:|:-----------:|:-----------:|
| Créer admin | ✅ | ❌ | ❌ | ❌ |
| Créer collectrice | ✅ | ✅ | ❌ | ❌ |
| Voir toutes les transactions | ✅ | ✅ | Ses collectrices | Siennes |
| Confirmer transaction | ✅ | ✅ | ✅ | ❌ |
| Créer transaction | ❌ | ❌ | ❌ | ✅ |
| Voir carte temps réel | ✅ | ✅ | Ses collectrices | ❌ |
| Générer rapports | ✅ | ✅ | Ses collectrices | ❌ |
| Résoudre alertes | ✅ | ✅ | ✅ | ❌ |
| Gérer zones | ✅ | ✅ | ❌ | ❌ |
| Paramètres organisation | ✅ | ✅ | ❌ | ❌ |

---

## 9. Géolocalisation & Temps Réel

### Hook de géolocalisation (collectrice)

```typescript
// hooks/useGeolocation.ts
export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        setPosition(pos)
        // Envoyer au serveur toutes les 30s
        await fetch("/api/positions", {
          method: "POST",
          body: JSON.stringify({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            precision: pos.coords.accuracy,
            vitesse: pos.coords.speed
          })
        })
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return position
}
```

### Pusher - Diffusion temps réel

```typescript
// lib/pusher.ts
import Pusher from "pusher"

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
})

// Après chaque POST /api/positions :
await pusherServer.trigger(
  `org-${organisationId}`,  // canal par organisation
  "position-update",
  {
    collectriceId,
    nom: `${user.prenom} ${user.nom}`,
    latitude,
    longitude,
    timestamp: new Date().toISOString()
  }
)

// Après chaque nouvelle transaction :
await pusherServer.trigger(
  `org-${organisationId}`,
  "nouvelle-transaction",
  { ...transactionData }
)
```

---

## 10. Système d'alertes & Détection d'anomalies

```typescript
// lib/anomalies.ts

export async function analyserTransaction(transaction: Transaction, collectrice: Utilisateur) {
  const alertes = []
  const params = await getParametres(collectrice.organisationId)

  // 1. Montant élevé
  if (transaction.montant > params.seuilMontantEleve) {
    alertes.push({
      type: "MONTANT_ELEVE",
      niveau: "AVERTISSEMENT",
      message: `Transaction de ${transaction.montant} FCFA détectée (seuil: ${params.seuilMontantEleve} FCFA)`
    })
  }

  // 2. Transaction hors horaires
  const heure = new Date().getHours()
  const [heureDebut] = params.heureDebutActivite.split(":").map(Number)
  const [heureFin] = params.heureFinActivite.split(":").map(Number)
  if (heure < heureDebut || heure > heureFin) {
    alertes.push({
      type: "HORS_HORAIRE",
      niveau: "CRITIQUE",
      message: `Transaction enregistrée hors des horaires d'activité`
    })
  }

  // 3. Zone inhabituelle
  if (transaction.latitude && collectrice.zoneId) {
    const zone = await getZone(collectrice.zoneId)
    const dansLaZone = pointInPolygon(
      [transaction.longitude!, transaction.latitude],
      zone.polygone
    )
    if (!dansLaZone) {
      alertes.push({
        type: "ZONE_INHABITUELLE",
        niveau: "CRITIQUE",
        message: `Transaction effectuée hors de la zone assignée`
      })
    }
  }

  // 4. Fréquence anormale (5+ transactions en 10 minutes)
  const transactionsRecentes = await compterTransactionsRecentes(collectrice.id, 10)
  if (transactionsRecentes >= 5) {
    alertes.push({
      type: "TRANSACTION_SUSPECTE",
      niveau: "CRITIQUE",
      message: `Fréquence de transactions anormalement élevée`
    })
  }

  // Créer les alertes en base et notifier via Pusher
  for (const alerte of alertes) {
    await creerAlerte({ ...alerte, collectriceId: collectrice.id, transactionId: transaction.id })
  }
}

// Job cron : vérifier l'inactivité des collectrices
export async function verifierInactivite() {
  const collectricesActives = await getCollectricesActives()
  const maintenant = new Date()
  
  for (const collectrice of collectricesActives) {
    const dernierePosition = await getDernierePosition(collectrice.id)
    if (!dernierePosition) continue
    
    const diffMinutes = (maintenant.getTime() - dernierePosition.timestamp.getTime()) / 60000
    
    if (diffMinutes > params.inactiviteSeuilMin) {
      await creerAlerte({
        type: "INACTIVITE_PROLONGEE",
        niveau: "AVERTISSEMENT",
        message: `Aucune position reçue depuis ${Math.round(diffMinutes)} minutes`,
        collectriceId: collectrice.id
      })
    }
  }
}
```

---

## 11. Rapports & Exports

### Structure d'un rapport quotidien

```typescript
interface RapportQuotidien {
  date: string
  organisation: string
  
  resume: {
    montantTotalCollecte: number
    nombreTransactions: number
    nombreCollectricesActives: number
    nombreClientsServis: number
    nombreAlertes: number
  }
  
  parCollectrice: Array<{
    collectrice: { id: string; nom: string; prenom: string }
    montantCollecte: number
    nombreTransactions: number
    premiereMouvement: string
    dernierMouvement: string
    distanceParcourue: number  // km estimés depuis les positions GPS
  }>
  
  parZone: Array<{
    zone: string
    montantCollecte: number
    nombreTransactions: number
  }>
  
  transactions: Transaction[]
  alertes: Alerte[]
}
```

### Export PDF avec @react-pdf/renderer

```typescript
// Génération d'un PDF formaté avec logo, tableaux et graphiques
const rapport = await genererRapportQuotidien(date, organisationId)
const blob = await pdf(<TemplateRapportPDF data={rapport} />).toBlob()
// Stocker dans S3 et retourner l'URL
```

---

## 12. Interfaces utilisateur (UI/UX)

### Pages Admin

#### `/dashboard` — Tableau de bord principal
- Header avec stats clés (4 cards)
- Carte Leaflet temps réel (60% de la largeur)
- Feed transactions récentes (40%)
- Graphique collectes par heure
- Banner alertes actives

#### `/carte` — Vue carte dédiée plein écran
- Carte plein écran avec marqueurs des collectrices
- Panel latéral escamotable avec liste des collectrices
- Filtres par zone, statut
- Historique d'itinéraire au clic

#### `/transactions` — Gestion des transactions
- Tableau paginé avec filtres avancés
- Colonnes : Date, Collectrice, Client, Montant, Type, Statut, Position
- Actions : Confirmer, Marquer suspecte, Voir détail
- Exports CSV/Excel

#### `/collectrices` — Gestion des collectrices
- Grille de cards avec photo, nom, statut en temps réel
- Stats individuelles sur chaque card
- Modale de création/édition

#### `/rapports` — Génération de rapports
- Sélecteur de période
- Aperçu des données avant génération
- Boutons télécharger PDF / Excel / Envoyer par email

### Pages Collectrice (Mobile PWA)

#### `/accueil` — Dashboard mobile
- Salutation + date
- Objectif du jour vs réalisé (barre de progression)
- Bouton CTA "Nouvelle transaction" (très visible)
- Résumé des dernières transactions

#### `/nouvelle-transaction`
- Recherche client (scan QR ou saisie)
- Fiche client affichée (nom, photo, solde actuel)
- Saisie montant (gros pavé numérique)
- Type de transaction (dépôt / retrait)
- Note optionnelle
- Bouton confirmer → animation de succès → reçu

---

## 13. Variables d'environnement

```bash
# .env.local

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/nunyacollect"

# NextAuth
NEXTAUTH_SECRET="votre_secret_aleatoire_32_chars_min"
NEXTAUTH_URL="http://localhost:3000"

# Pusher (temps réel)
PUSHER_APP_ID="..."
NEXT_PUBLIC_PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER="eu"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@nunyacollect.com"

# Stockage fichiers (AWS S3 ou Vercel Blob)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="nunyacollect"
AWS_REGION="eu-west-1"

# SMS (optionnel - Africa's Talking pour Afrique de l'Ouest)
AFRICASTALKING_API_KEY="..."
AFRICASTALKING_USERNAME="..."

# Mapbox (optionnel, si Mapbox au lieu de Leaflet)
NEXT_PUBLIC_MAPBOX_TOKEN="pk...."
```

---

## 14. Installation & Démarrage

### Prérequis

- Node.js `>= 20.x`
- pnpm `>= 9.x` (recommandé) ou npm/yarn
- Docker & Docker Compose (pour la DB locale)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-org/nunyacollect.git
cd nunyacollect
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Démarrer la base de données locale

```bash
# docker-compose.yml inclut PostgreSQL + Redis
docker-compose up -d
```

### 4. Configurer les variables d'environnement

```bash
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma
pnpm prisma generate

# Appliquer les migrations
pnpm prisma migrate dev --name init

# Peupler avec des données de test
pnpm prisma db seed
```

### 6. Lancer le serveur de développement

```bash
pnpm dev
```

L'application est disponible sur `http://localhost:3000`

**Comptes de test créés par le seed :**

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@nunyacollect.com | Admin123! | Super Admin |
| gestionnaire@test.com | Test123! | Admin |
| superviseur@test.com | Test123! | Superviseur |
| collectrice1@test.com | Test123! | Collectrice |

---

## 15. Déploiement

### Option A : Vercel (recommandé)

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Déployer
vercel --prod
```

Configurer les variables d'environnement dans le dashboard Vercel.

**Services hébergés recommandés :**
- **DB** : [Neon.tech](https://neon.tech) (PostgreSQL serverless gratuit)
- **Redis** : [Upstash](https://upstash.com) (gratuit)
- **Temps réel** : [Pusher](https://pusher.com) (plan sandbox gratuit)
- **Email** : [Resend](https://resend.com) (3000 emails/mois gratuit)
- **Stockage** : Vercel Blob

### Option B : VPS / Docker

```bash
# Build
docker build -t nunyacollect .

# Run
docker-compose -f docker-compose.prod.yml up -d
```

---

## 16. Sécurité

- **Mots de passe** : Hachés avec bcrypt (salt rounds: 12)
- **JWT** : Signés avec `NEXTAUTH_SECRET`, expiration 24h
- **HTTPS** : Obligatoire en production
- **CORS** : Configuré pour les origines autorisées uniquement
- **Rate limiting** : Via Upstash Redis sur les routes d'auth (5 tentatives / 15min)
- **Validation** : Zod sur toutes les entrées API (server-side)
- **RBAC** : Vérification du rôle sur chaque route protégée
- **SQL Injection** : Impossible grâce à Prisma ORM (requêtes paramétrées)
- **XSS** : Next.js échappe automatiquement le HTML
- **Upload fichiers** : Validation du type MIME et taille max (5 Mo)
- **Logs** : Toutes les actions sensibles sont journalisées

---

## 17. Roadmap

### Phase 1 — MVP
- [x] Authentification complète (connexion, rôles, JWT)
- [x] Interface collectrice mobile (transactions, géoloc)
- [x] Tableau de bord admin avec carte temps réel
- [x] Gestion des clients
- [x] Alertes de base

### Phase 2 — Complétion
- [ ] Rapports PDF & Excel complets
- [ ] Système d'alertes avancé (zones, anomalies)
- [ ] Historique d'itinéraires sur la carte
- [ ] Notifications SMS (Africa's Talking)
- [ ] PWA — mode hors-ligne partiel pour la collectrice

### Phase 3 — Améliorations
- [ ] Application mobile React Native (iOS & Android)
- [ ] Portail client (consultation du solde)
- [ ] Intelligence artificielle : prédictions de collecte
- [ ] Multi-organisations (SaaS)
- [ ] API publique pour intégrations tierces

---

> **NunyaCollect** — *Digitalisons la micro-finance en Afrique de l'Ouest.*
>
> Développé avec ❤️ | Stack : Next.js · PostgreSQL · Prisma · Tailwind CSS · Leaflet · Pusher
