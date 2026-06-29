# Moov' Togo 🏍️🍽️📦

**Super-app Mobilité & Livraison pour le Togo**

📍 **GitHub** : https://github.com/AMOUZOU-Kodjo/moov-togo  
🚀 **Backend** : Déployé sur Railway  
🌐 **Frontend** : Déployé sur Cloudflare Pages  

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Backend | Node.js + Express (JavaScript) |
| Base de données | PostgreSQL + Prisma ORM |
| Realtime | Socket.IO (géolocalisation temps réel) |
| Frontend | React + Vite + TailwindCSS + DaisyUI |
| Icons | Lucide React |
| Paiement | Flooz / TMoney Mobile Money |
| PWA | Téléchargeable sur mobile et desktop |

## Structure

```
moov-togo/
├── backend/                # API REST (JavaScript)
│   ├── prisma/             # Schéma DB + seeds
│   ├── src/
│   │   ├── controllers/    # Logique des endpoints
│   │   ├── services/       # Logique métier
│   │   ├── routes/         # Définition des routes
│   │   ├── middleware/      # Auth JWT, gestion erreurs
│   │   ├── config/         # Configuration
│   │   └── index.js        # Point d'entrée
│   ├── railway.json        # Config Railway
│   └── package.json
│
├── web/                    # App React (JSX)
│   ├── src/
│   │   ├── pages/          # Landing, Login, Home, Ride, Food, Parcel, Payment, History, Profile, Drivers, Admin
│   │   ├── components/     # Layout, composants réutilisables
│   │   ├── services/       # Client API Axios
│   │   ├── context/        # AuthContext
│   │   └── index.css       # Tailwind + DaisyUI
│   ├── _redirects          # SPA routing Cloudflare
│   ├── cloudflare.toml     # Config Cloudflare Pages
│   └── package.json
│
└── README.md
```

## Fonctionnalités

### 🏍️ Mobilité
- Réservation de zémidjans et taxis
- Estimation du prix en temps réel
- Paiement Flooz/TMoney
- Interface chauffeur dédiée

### 🍽️ Livraison de repas
- Cantines près de chez vous (géolocalisation)
- Menu détaillé, panier, commande
- Livraison rapide

### 📦 Envoi de colis
- Local et inter-ville (Lomé → Kara → Atakpamé)
- Saisie destinataire avec notification

## Déploiement

### 1. Render (Backend + PostgreSQL)

**Option A — Dashboard (recommandé) :**
1. Aller sur [render.com](https://render.com) → **New Web Service**
2. Connecter le repo GitHub `AMOUZOU-Kodjo/moov-togo`
3. Config :
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : `npm install && npx prisma generate`
   - **Start Command** : `npx prisma migrate deploy && node src/index.js`
   - **Plan** : Free
4. Ajouter la variable d'environnement `JWT_SECRET` (clé sécurisée)
5. Créer une **PostgreSQL** database → New → PostgreSQL → lier au web service
6. Déployer ✅

**Option B — Blueprint (`render.yaml`) :**
Le fichier `render.yaml` déjà présent dans `backend/` configure automatiquement :
- Le service web Node.js
- La base de données PostgreSQL (gratuite)
- Les variables d'environnement
- Le health check sur `/api/health`

Pour l'utiliser : Render Dashboard → New → Blueprint → connecter le repo

### 2. Cloudflare Pages (Frontend)

```bash
cd web
npm run build    # Produit le dossier dist/
```

**Via Dashboard :**
1. [Cloudflare Pages](https://pages.cloudflare.com) → Create project → Connecter le repo
2. Framework : React | Build : `npm run build` | Output : `dist`
3. Déployer ✅

**Via CLI (Wrangler) :**
```bash
npm i -g wrangler
wrangler pages deploy dist
```

## API Endpoints

Base URL : `https://moov-togo-nom-de-votre-app.koyeb.app/api`

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/send-otp` | Envoi code de vérification SMS |
| POST | `/auth/verify-otp` | Connexion + retour JWT |
| GET | `/auth/profile` | Profil utilisateur |
| PUT | `/auth/profile` | Mettre à jour le profil |

### Courses
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/rides/estimate` | Estimation du prix |
| POST | `/rides` | Créer une course |
| GET | `/rides` | Historique des courses |
| POST | `/rides/:id/accept` | Accepter une course (chauffeur) |
| PATCH | `/rides/:id/status` | Mettre à jour le statut |

### Livraisons
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/deliveries/cantines` | Cantines à proximité |
| POST | `/deliveries/food` | Commander un repas |
| POST | `/deliveries/parcel` | Envoyer un colis |
| GET | `/deliveries` | Historique des livraisons |

### Paiements
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/payments/pay` | Payer par Flooz/TMoney |
| GET | `/payments/history` | Historique des paiements |
| GET | `/payments/wallet` | Solde du wallet |

## Environnement (`.env`)

```env
PORT=4000
DATABASE_URL="postgresql://..."
JWT_SECRET="votre-secret"
FLOOZ_API_KEY="..."
TMONEY_API_KEY="..."
PLATFORM_COMMISSION_RIDE=15
PLATFORM_COMMISSION_FOOD=10
PLATFORM_COMMISSION_PARCEL=12
```

## Licence
MIT
