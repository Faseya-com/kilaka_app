# Plateforme de Services Professionnels

Une plateforme moderne de mise en relation entre clients et prestataires de services, développée avec Next.js et Supabase.

## À propos

Cette plateforme permet aux utilisateurs de trouver et de réserver des services professionnels dans diverses catégories (beauté, santé, réparations, etc.), tout en offrant aux prestataires un espace complet pour gérer leurs activités.

## Fonctionnalités principales

### Pour les clients
- Recherche et navigation par catégories de services
- Consultation de profils détaillés des prestataires
- Système de réservation de rendez-vous
- Messagerie intégrée
- Système d'évaluation et d'avis
- Gestion du profil utilisateur
- Tableau de bord personnalisé

### Pour les prestataires
- Processus d'inscription complet en plusieurs étapes
- Gestion des services offerts
- Calendrier de rendez-vous
- Messagerie client
- Portfolio de réalisations
- Gestion des paramètres de compte
- Méthodes de paiement multiples

### Gestion des paramètres utilisateur
- **Profil personnel** : Avatar, nom complet, informations du compte
- **Méthodes de paiement** :
  - Portefeuille mobile (Orange Money, MTN, Moov)
  - Compte bancaire
  - PayPal
- **Notifications personnalisables** :
  - Email, Push, SMS
  - Offres d'emploi/services
  - Paiements et factures
  - Notifications système
- **Sécurité** : Authentification à deux facteurs
- **Historique** : Suivi des connexions récentes

## Stack technique

### Frontend
- **Next.js 13.5.1** - Framework React avec App Router
- **React 18.2.0** - Bibliothèque UI
- **Tailwind CSS 3.3.3** - Framework CSS utility-first
- **shadcn/ui** - Composants UI réutilisables
- **Radix UI** - Composants accessibles headless
- **Lucide React** - Icônes modernes

### Backend & Base de données
- **Supabase** - Backend-as-a-Service (BaaS)
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions
  - Real-time subscriptions

### Autres bibliothèques
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas
- **date-fns** - Manipulation de dates
- **Recharts** - Graphiques et visualisations
- **Sonner** - Notifications toast

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 16.x ou supérieur
- **npm** ou **yarn**
- **Git**
- Un compte **Supabase** (gratuit)

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repository>
cd project
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 4. Configuration Supabase

#### a) Créer un projet Supabase
1. Rendez-vous sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez l'URL et la clé anonyme dans les paramètres de l'API

#### b) Appliquer les migrations
Les migrations se trouvent dans `supabase/migrations/`. Elles créent automatiquement :
- Tables utilisateurs et profils
- Tables de prestataires et services
- Tables de rendez-vous et avis
- Tables de messages
- Tables de catégories de services
- Tables d'onboarding des prestataires
- Tables de paramètres utilisateur

Les migrations peuvent être appliquées via l'interface Supabase ou le CLI Supabase.

## Lancement du projet

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build de production

```bash
npm run build
npm start
```

### Autres commandes

```bash
# Linter
npm run lint

# Vérification des types TypeScript
npm run typecheck
```

## Structure du projet

```
project/
├── app/                          # Routes Next.js (App Router)
│   ├── become-provider/          # Inscription prestataire
│   │   └── onboarding/          # Processus d'onboarding
│   ├── dashboard/               # Tableau de bord
│   │   ├── appointments/        # Gestion des rendez-vous
│   │   ├── messages/            # Messagerie
│   │   ├── services/            # Gestion des services
│   │   ├── settings/            # Paramètres utilisateur
│   │   └── works/               # Portfolio
│   ├── login/                   # Connexion
│   ├── providers/               # Liste et profils prestataires
│   │   └── [id]/               # Profil prestataire individuel
│   ├── register/                # Inscription
│   ├── services/                # Pages de services
│   ├── layout.js               # Layout principal
│   ├── page.js                 # Page d'accueil
│   └── globals.css             # Styles globaux
├── components/                  # Composants React
│   ├── ui/                     # Composants UI (shadcn/ui)
│   ├── DashboardLayout.js      # Layout du tableau de bord
│   └── ProtectedRoute.js       # HOC pour routes protégées
├── contexts/                    # Contexts React
│   └── AuthContext.js          # Contexte d'authentification
├── hooks/                       # Hooks personnalisés
│   └── use-toast.ts            # Hook pour notifications
├── lib/                        # Utilitaires
│   ├── supabase.js            # Client Supabase
│   └── utils.ts               # Fonctions utilitaires
├── supabase/                   # Configuration Supabase
│   ├── functions/             # Edge Functions
│   └── migrations/            # Migrations SQL
├── .env                       # Variables d'environnement
├── next.config.js            # Configuration Next.js
├── tailwind.config.ts        # Configuration Tailwind
└── package.json              # Dépendances du projet
```

## Principales fonctionnalités techniques

### Authentification
- Authentification par email/mot de passe via Supabase Auth
- Sessions persistantes
- Routes protégées avec `ProtectedRoute`
- Gestion du contexte utilisateur global

### Base de données
- **PostgreSQL** avec Supabase
- **Row Level Security (RLS)** sur toutes les tables
- Politiques de sécurité strictes
- Relations entre tables optimisées
- Migrations versionnées

### Sécurité
- Authentification à deux facteurs
- RLS activé sur toutes les tables
- Validation côté client et serveur
- Protection contre les injections SQL
- Gestion sécurisée des sessions

### Performance
- Static Site Generation (SSG) pour les pages statiques
- Server-side Rendering (SSR) pour les pages dynamiques
- Optimisation des images Next.js
- Code splitting automatique
- Lazy loading des composants

## Pages principales

### Public
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/providers` - Liste des prestataires
- `/providers/[id]` - Profil d'un prestataire
- `/services/[slug]` - Page de catégorie de service

### Protégées (authentification requise)
- `/dashboard` - Tableau de bord
- `/dashboard/appointments` - Rendez-vous
- `/dashboard/messages` - Messagerie
- `/dashboard/services` - Gestion des services
- `/dashboard/settings` - Paramètres
- `/dashboard/works` - Portfolio
- `/become-provider` - Devenir prestataire
- `/become-provider/onboarding` - Processus d'onboarding

## Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=        # URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Clé anonyme publique
```

## Base de données

### Tables principales

#### Utilisateurs et profils
- `profiles` - Profils utilisateurs
- `user_notification_preferences` - Préférences de notifications
- `user_payment_methods` - Méthodes de paiement
- `user_login_history` - Historique de connexion
- `user_security_settings` - Paramètres de sécurité

#### Prestataires
- `providers` - Informations des prestataires
- `provider_services` - Services offerts
- `provider_onboarding` - Processus d'inscription
- `provider_service_selections` - Sélection de catégories
- `provider_skills` - Compétences et tarifs
- `provider_certifications` - Certifications
- `provider_portfolio` - Portfolio
- `provider_payment_info` - Informations de paiement
- `provider_kyc_documents` - Documents KYC

#### Services et catégories
- `service_categories` - Catégories de services
- `service_subcategories` - Sous-catégories
- `services` - Services créés par les utilisateurs
- `works` - Réalisations/portfolio

#### Interactions
- `appointments` - Rendez-vous
- `reviews` - Avis et évaluations
- `messages` - Messagerie

## Personnalisation

### Thème et couleurs
Les couleurs principales peuvent être modifiées dans `tailwind.config.ts`. Le projet utilise une palette verte par défaut pour un aspect naturel et professionnel.

### Composants UI
Les composants shadcn/ui sont entièrement personnalisables dans le dossier `components/ui/`.

## Déploiement

### Vercel (recommandé)
Le déploiement sur Vercel est automatique et optimisé pour Next.js :

1. Push votre code sur GitHub
2. Connectez votre repository à Vercel
3. Ajoutez les variables d'environnement
4. Déployez

### Autres plateformes
Le projet peut être déployé sur toute plateforme supportant Next.js :
- Netlify
- AWS Amplify
- Railway
- Render

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.

## Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation Supabase : [docs.supabase.com](https://docs.supabase.com)
- Consultez la documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)

## Auteurs

Développé avec Next.js, Supabase, et beaucoup de café.
# kilaka_app
