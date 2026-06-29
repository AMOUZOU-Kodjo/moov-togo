# Moov' Togo 🏍️🍽️📦

**Super-app Mobilité & Livraison pour le Togo**

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Backend | Node.js + Express + TypeScript |
| Base de données | PostgreSQL + Prisma ORM |
| Realtime | Socket.IO (géolocalisation temps réel) |
| Mobile | React Native (Expo) - iOS & Android |
| Admin Web | React + Vite + Recharts |
| Paiement | Flooz / TMoney Mobile Money |
| Maps | Mapbox / OpenStreetMap |

## Structure du projet

```
moov-togo/
├── backend/                # API REST
│   ├── prisma/             # Schéma DB + seeds
│   ├── src/
│   │   ├── controllers/    # Logique des endpoints
│   │   ├── services/       # Logique métier
│   │   ├── routes/         # Définition des routes
│   │   ├── middleware/      # Auth, erreurs
│   │   ├── config/         # Configuration
│   │   ├── types/          # Types TypeScript
│   │   └── index.ts        # Point d'entrée
│   └── package.json
│
├── mobile/                 # App React Native
│   ├── src/
│   │   ├── screens/        # Écrans (Login, Home, Ride, Food, Parcel, Payment, Profile)
│   │   ├── components/     # Composants réutilisables
│   │   ├── navigation/     # Navigation (Stack + Tabs)
│   │   ├── services/       # API client + Socket.IO
│   │   ├── context/        # AuthContext
│   │   └── hooks/          # Custom hooks
│   └── package.json
│
├── admin/                  # Dashboard admin web
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
│
└── README.md
```

## Fonctionnalités

### 🏍️ Mobilité
- Réservation de zémidjans et taxis
- Estimation du prix en temps réel
- Géolocalisation des chauffeurs disponibles
- Paiement Mobile Money (Flooz/TMoney)
- Notation des chauffeurs

### 🍽️ Livraison de repas
- Liste des cantines près de chez vous
- Menu détaillé avec prix
- Commande et paiement en ligne
- Livraison par zémidjan

### 📦 Envoi de colis
- Envoi local et inter-ville (Lomé → Kara, etc.)
- Saisie destinataire avec notification
- Prix calculé selon distance
- Suivi en temps réel

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL
- Expo CLI (pour le mobile)

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurer vos clés API
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### Admin
```bash
cd admin
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/send-otp` - Envoi code SMS
- `POST /api/auth/verify-otp` - Connexion

### Courses
- `POST /api/rides/estimate` - Estimation prix
- `POST /api/rides` - Créer une course
- `POST /api/rides/:id/accept` - Accepter (chauffeur)
- `PATCH /api/rides/:id/status` - Màj statut

### Livraisons
- `GET /api/deliveries/cantines` - Cantines à proximité
- `POST /api/deliveries/food` - Commander repas
- `POST /api/deliveries/parcel` - Envoyer colis

### Paiements
- `POST /api/payments/pay` - Payer (Flooz/TMoney)
- `GET /api/payments/wallet` - Solde wallet

## Licence
MIT
