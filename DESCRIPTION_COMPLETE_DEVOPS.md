# Description Complète de l'Application - Pour Intégration DevOps

## 🎯 Vue d'ensemble du projet

**Nom du projet**: SkillUpTN - Système de Recommandation d'Activités RH avec Intelligence Artificielle

**Objectif**: Plateforme de gestion des compétences et de recommandation d'activités de formation pour les employés, utilisant l'IA pour optimiser l'attribution des formations en fonction des compétences, disponibilités et historiques des employés.

**Type d'application**: Application web full-stack avec microservices

---

## 🏗️ Architecture Technique Globale

### Architecture Microservices

L'application est composée de **4 services principaux** :

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                    Port 5173 (Vite Dev Server)                  │
│  • Interface utilisateur multi-rôles                            │
│  • Contrôle gestuel (MediaPipe)                                 │
│  • Intégration Google Calendar                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ HTTP REST API
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS + MongoDB)                   │
│                          Port 3000                              │
│  • API REST avec authentification JWT                           │
│  • Gestion des utilisateurs et rôles                            │
│  • CRUD activités et recommandations                            │
│  • WebSocket pour notifications temps réel                      │
│  • Génération de certificats PDF                                │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             ↓ HTTP                          ↓ HTTP
┌────────────────────────────┐  ┌───────────────────────────────┐
│   AI SERVICE (Python)      │  │   RASA CHATBOT (Python)       │
│       Port 8000            │  │   Port 5005 (Rasa Server)     │
│  • Extraction NLP          │  │   Port 5055 (Actions Server)  │
│  • Scoring ML              │  │  • Compréhension NLU          │
│  • Recommandations IA      │  │  • Réponses contextuelles     │
│  • Feedback loop           │  │  • Actions personnalisées     │
└────────────────────────────┘  └───────────────────────────────┘
```

---

## 📦 Détails des Services

### 1. FRONTEND - Interface Utilisateur (React + TypeScript)

**Technologies**:
- **Framework**: React 18.3.1 avec TypeScript 5.7.3
- **Build Tool**: Vite 6.0.7
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI (composants accessibles)
- **Routing**: React Router DOM 7.1.1
- **State Management**: React Hooks
- **Testing**: Vitest 4.1.2 + Fast-check 4.6.0 (Property-Based Testing)
- **HTTP Client**: Axios 1.7.9
- **WebSocket**: Socket.io-client 4.8.1

**Fonctionnalités principales**:
- **4 rôles utilisateurs**: Admin, RH, Manager, Employé
- **Dashboards personnalisés** par rôle
- **Gestion des activités** (création, modification, suppression)
- **Système de recommandations** avec scoring IA
- **Notifications en temps réel** (WebSocket)
- **Contrôle gestuel** via webcam (MediaPipe Hands)
- **Intégration Google Calendar** (OAuth2)
- **Chatbot RH** intégré (Rasa)
- **Reformulation IA** des messages
- **Génération et téléchargement de certificats PDF**
- **Export de données** (Excel, PDF)

**Structure des dossiers**:
```
frontend/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Chatbot.tsx   # Chatbot RH
│   │   ├── HandGestureControl.tsx  # Contrôle gestuel
│   │   └── GoogleCalendarConnect.tsx
│   ├── pages/            # Pages par rôle
│   │   ├── admin/        # Pages admin
│   │   ├── hr/           # Pages RH
│   │   ├── manager/      # Pages manager
│   │   └── employee/     # Pages employé
│   ├── services/         # Services API
│   │   ├── authService.ts
│   │   ├── activityService.ts
│   │   ├── recommendationService.ts
│   │   ├── chatService.ts
│   │   └── googleCalendarService.ts
│   ├── hooks/            # Custom hooks
│   │   └── useHandGesture.ts
│   ├── utils/            # Utilitaires
│   │   ├── gestureDetector.ts
│   │   ├── gestureValidator.ts
│   │   └── canvasRenderer.ts
│   └── types/            # Types TypeScript
├── package.json
└── vite.config.ts
```

**Variables d'environnement** (`.env`):
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=<Google OAuth Client ID>
VITE_GOOGLE_API_KEY=<Google API Key>
```

**Scripts disponibles**:
```json
{
  "dev": "vite",                    # Démarrage dev
  "build": "tsc -b && vite build",  # Build production
  "preview": "vite preview",        # Preview build
  "test": "vitest run",             # Tests unitaires
  "test:ci": "vitest run --coverage" # Tests CI avec coverage
}
```

---

### 2. BACKEND - API REST (NestJS + MongoDB)

**Technologies**:
- **Framework**: NestJS 11.0.1 (Node.js)
- **Base de données**: MongoDB 9.1.5 avec Mongoose
- **Authentification**: JWT (Passport) + Google OAuth2
- **WebSocket**: Socket.io 4.8.1
- **Validation**: Class-validator + Class-transformer
- **Documentation API**: Swagger 11.0.6
- **Testing**: Jest 30.0.0 + Fast-check 4.6.0
- **Email**: Nodemailer 6.10.1 avec templates Handlebars
- **PDF**: jsPDF + pdf-lib + pptxgenjs

**Modules principaux**:

1. **Auth Module** (`src/auth/`)
   - Authentification JWT
   - Google OAuth2
   - Guards de rôles (Admin, HR, Manager, Employee)
   - Protection des routes

2. **Activities Module** (`src/activities/`)
   - CRUD activités de formation
   - Génération de certificats PDF
   - Export PowerPoint

3. **Recommendations Module** (`src/recommendations/`)
   - Génération de recommandations IA
   - Validation RH
   - Confirmation manager
   - Réponse employé

4. **Manager Module** (`src/manager/`)
   - Gestion des demandes d'activités
   - Confirmation/rejet des participants
   - Évaluation des compétences

5. **Chat Module** (`src/chat/`)
   - Intégration avec Rasa
   - Reformulation IA des messages (OpenRouter)
   - Enrichissement du contexte

6. **Notifications Module** (`src/notifications/`)
   - WebSocket Gateway
   - Notifications en temps réel
   - Historique des notifications

7. **Audit Module** (`src/audit/`)
   - Logs d'audit
   - Traçabilité des actions

8. **Mail Module** (`src/mail/`)
   - Envoi d'emails
   - Templates Handlebars

**Structure des dossiers**:
```
backend/
├── src/
│   ├── auth/             # Authentification
│   ├── activities/       # Gestion activités
│   ├── recommendations/  # Recommandations IA
│   ├── manager/          # Module manager
│   ├── chat/             # Chatbot et reformulation
│   ├── notifications/    # Notifications temps réel
│   ├── audit/            # Logs d'audit
│   ├── mail/             # Envoi d'emails
│   └── main.ts           # Point d'entrée
├── package.json
└── nest-cli.json
```

**Variables d'environnement** (`.env`):
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/employee-recommendation-system

# JWT
JWT_SECRET=<secret_key>
JWT_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=<Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Services externes
AI_SERVICE_URL=http://localhost:8000
RASA_URL=http://localhost:5005

# OpenRouter (Reformulation IA)
OPENROUTER_API_KEY=<OpenRouter API Key>

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=<email>
MAIL_PASSWORD=<password>
MAIL_FROM=noreply@skilluptn.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Scripts disponibles**:
```json
{
  "start:dev": "nest start --watch",        # Démarrage dev
  "build": "nest build",                    # Build production
  "start:prod": "node dist/main",           # Démarrage production
  "test": "jest",                           # Tests unitaires
  "test:ci": "jest --ci --coverage",        # Tests CI
  "seed:accounts": "ts-node src/scripts/create-three-accounts.ts",
  "seed:competences": "ts-node src/scripts/seed-real-competences.ts",
  "db:reset:seed": "ts-node src/scripts/reset-and-seed-full.ts"
}
```

**Endpoints API principaux**:
```
# Authentification
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/google
GET    /api/auth/google/callback

# Activités
GET    /api/activities
POST   /api/activities
GET    /api/activities/:id
PUT    /api/activities/:id
DELETE /api/activities/:id

# Recommandations
POST   /api/recommendations/generate
GET    /api/recommendations/activity/:activityId
PUT    /api/recommendations/:id/validate
POST   /api/recommendations/:id/respond

# Manager
POST   /api/manager/confirm-participants
POST   /api/manager/reject-participant
GET    /api/manager/pending

# Chat
POST   /api/chat
POST   /api/chat/rewrite

# Notifications
GET    /api/notifications
PUT    /api/notifications/:id/read
WebSocket: ws://localhost:3000
```

---

### 3. AI SERVICE - Intelligence Artificielle (Python + FastAPI)

**Technologies**:
- **Framework**: FastAPI
- **Server**: Uvicorn
- **NLP**: spaCy + sentence-transformers
- **ML**: scikit-learn + torch + scipy
- **IA**: Anthropic Claude (API)
- **Cache**: Redis
- **Testing**: pytest

**Fonctionnalités**:
1. **Extraction NLP des compétences**
   - Analyse des descriptions d'activités
   - Extraction des compétences requises
   - Ontologie des compétences (skills_ontology.json)

2. **Scoring et recommandations ML**
   - Calcul de scores basé sur :
     - Correspondance des compétences (40%)
     - Niveau de compétence (30%)
     - Disponibilité (20%)
     - Historique de participation (10%)
   - Calibration des scores avec feedback

3. **Feedback loop**
   - Apprentissage continu
   - Amélioration des recommandations
   - Ajustement des poids

4. **Intégration Anthropic Claude**
   - Génération de descriptions
   - Analyse sémantique

**Structure des dossiers**:
```
ai-service/
├── app/
│   ├── models/           # Modèles de données
│   │   └── ai_models.py
│   ├── services/         # Services métier
│   │   ├── nlp_service.py          # Extraction NLP
│   │   ├── scoring_engine.py       # Scoring ML
│   │   ├── llm_service.py          # Intégration Claude
│   │   ├── feedback_processor.py   # Feedback loop
│   │   ├── kpi_service.py          # KPIs
│   │   ├── vector_cache.py         # Cache vectoriel
│   │   └── retrain_worker.py       # Réentraînement
│   └── routes/           # Routes API
├── data/
│   ├── skills_ontology.json        # Ontologie compétences
│   └── models/                     # Modèles entraînés
├── tests/
│   ├── test_nlp_service.py
│   └── test_scoring_engine.py
├── main.py
└── requirements.txt
```

**Variables d'environnement** (`.env`):
```env
ANTHROPIC_API_KEY=<Anthropic API Key>
REDIS_URL=redis://localhost:6379
```

**Endpoints API**:
```
POST   /extract-skills      # Extraction de compétences
POST   /score-candidates    # Scoring des candidats
POST   /feedback            # Feedback pour amélioration
GET    /kpis                # Métriques du système
```

**Scripts de démarrage**:
```bash
# Windows CMD
start-ai.cmd

# PowerShell
start-ai.ps1

# Manuel
python main.py
```

---

### 4. RASA CHATBOT - Assistant RH (Python + Rasa)

**Technologies**:
- **Framework**: Rasa 3.x
- **SDK**: Rasa SDK (Actions Server)
- **NLU**: DIETClassifier + TEDPolicy
- **Python**: 3.10

**Fonctionnalités**:
- Compréhension du langage naturel en français
- 8 types de questions supportées :
  1. Salutations (`greet`)
  2. Au revoir (`goodbye`)
  3. Explication de l'activité (`explain_activity`)
  4. Raison de la recommandation (`why_recommended`)
  5. Compétences à développer (`skills_gained`)
  6. Durée de l'activité (`ask_duration`)
  7. Lieu de l'activité (`ask_location`)
  8. Dates de l'activité (`ask_date`)

**Pipeline NLP**:
```
Message utilisateur
    ↓
Tokenisation (WhitespaceTokenizer)
    ↓
Vectorisation (CountVectorsFeaturizer)
    ↓
Classification d'intent (DIETClassifier)
    ↓
Sélection d'action (TEDPolicy)
    ↓
Exécution de l'action personnalisée
    ↓
Génération de la réponse
```

**Structure des dossiers**:
```
rasa-chatbot/
├── config.yml           # Configuration pipeline NLP
├── domain.yml           # Intents, actions, slots
├── endpoints.yml        # Configuration serveurs
├── data/
│   ├── nlu.yml         # Exemples d'entraînement (76+)
│   └── stories.yml     # Flux de conversation (15+)
├── actions/
│   ├── __init__.py
│   └── actions.py      # 6 actions personnalisées
├── models/             # Modèles entraînés
├── tests/
│   ├── test_stories_completeness.py
│   └── test_training_completeness.py
└── docs/
    ├── QUICK_TEST_COMMANDS.md
    ├── CHECKPOINT_TESTING_GUIDE.md
    └── STORIES_GUIDE.md
```

**Entraînement du modèle**:
```bash
cd rasa-chatbot
rasa train
```

**Démarrage**:
```bash
# Terminal 1 - Actions Server
rasa run actions

# Terminal 2 - Rasa Server
rasa run --enable-api --cors "*"
```

**Ports**:
- Rasa Server: 5005
- Actions Server: 5055

---

## 🗄️ Base de Données MongoDB

**Collections principales**:

1. **users**
   - Utilisateurs du système
   - Rôles : ADMIN, HR, MANAGER, EMPLOYEE
   - Authentification JWT + Google OAuth

2. **activities**
   - Activités de formation
   - Titre, description, compétences, dates, lieu
   - Statut : draft, published, completed

3. **recommendations**
   - Recommandations IA
   - Score, justification, statut
   - Lien activité ↔ employé

4. **activity-requests**
   - Demandes d'activités par les managers
   - Workflow de validation

5. **notifications**
   - Notifications temps réel
   - Statut lu/non lu

6. **audit-logs**
   - Logs d'audit
   - Traçabilité des actions

7. **competences**
   - Référentiel des compétences
   - Ontologie hiérarchique

8. **departments**
   - Départements de l'entreprise

---

## 🔐 Sécurité et Authentification

### Authentification
- **JWT** (JSON Web Tokens) avec expiration 7 jours
- **Google OAuth2** pour connexion sociale
- **Bcrypt** pour hashage des mots de passe

### Autorisation
- **Guards NestJS** :
  - `JwtAuthGuard` : Vérifie le token JWT
  - `RolesGuard` : Vérifie les permissions par rôle
- **Décorateur `@Roles()`** pour définir les accès

### Protection des routes
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR', 'MANAGER')
@Get('activity/:activityId')
async getByActivity(@Param('activityId') activityId: string) {
  // Seuls HR et MANAGER peuvent accéder
}
```

---

## 🔄 Workflow Métier Complet

### Workflow de Recommandation d'Activité

```
1. RH crée une activité
   ↓
2. RH génère des recommandations IA
   (AI Service analyse les compétences et calcule les scores)
   ↓
3. RH valide/ajuste les scores
   ↓
4. RH notifie les managers
   (Notification WebSocket)
   ↓
5. Manager confirme/rejette les participants
   ↓
6. Employés reçoivent une notification
   (Notification WebSocket)
   ↓
7. Employé accepte/refuse avec justification
   (Option : Contrôle gestuel pour accepter/refuser)
   (Option : Ajout automatique à Google Calendar)
   ↓
8. Activité réalisée
   ↓
9. Mise à jour des compétences de l'employé
   ↓
10. Génération de certificat PDF
```

---

## 🚀 Démarrage de l'Application

### Prérequis
- **Node.js** 16+ et npm
- **Python** 3.10
- **MongoDB** 4.4+
- **Redis** (optionnel, pour AI Service)

### Installation et Démarrage

#### 1. MongoDB
```bash
# Démarrer MongoDB
mongod
```

#### 2. Backend (NestJS)
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npm run start:dev
```
**Port**: 3000

#### 3. Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npm run dev
```
**Port**: 5173

#### 4. AI Service (Python)
```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate  # Windows
# ou
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp env.example .env
# Configurer ANTHROPIC_API_KEY dans .env
python main.py
```
**Port**: 8000

#### 5. Rasa Chatbot (optionnel)
```bash
cd rasa-chatbot
pip install rasa rasa-sdk
rasa train

# Terminal 1
rasa run actions

# Terminal 2
rasa run --enable-api --cors "*"
```
**Ports**: 5005 (Rasa), 5055 (Actions)

### Scripts de Démarrage Rapide

**Windows CMD**:
```cmd
COMMANDES_TEST_IMMEDIAT.cmd
```

**PowerShell**:
```powershell
.\COMMANDES_TEST_IMMEDIAT.ps1
```

---

## 🧪 Tests

### Frontend (Vitest)
```bash
cd frontend
npm run test          # Tests unitaires
npm run test:ci       # Tests CI avec coverage
npm run test:watch    # Mode watch
```

### Backend (Jest)
```bash
cd backend
npm run test          # Tests unitaires
npm run test:ci       # Tests CI avec coverage
npm run test:e2e      # Tests end-to-end
```

### AI Service (pytest)
```bash
cd ai-service
pytest
```

### Rasa (Tests de stories)
```bash
cd rasa-chatbot
rasa test
```

---

## 📊 Métriques et Monitoring

### KPIs du système
- Nombre de recommandations générées
- Taux d'acceptation des recommandations
- Précision du scoring IA
- Temps de réponse des API
- Taux d'utilisation par rôle

### Logs
- **Backend**: Logs NestJS (console + fichiers)
- **AI Service**: Logs Python (uvicorn)
- **Rasa**: Logs Rasa (console)
- **Audit**: Collection MongoDB `audit-logs`

---

## 🌐 APIs Externes Utilisées

1. **Google OAuth2** - Authentification
2. **Google Calendar API** - Intégration calendrier
3. **Anthropic Claude** - IA générative (AI Service)
4. **OpenRouter (DeepSeek)** - Reformulation de messages

---

## 📝 Documentation Disponible

### Documentation Technique
- `SETUP_TEAM.md` - Configuration pour l'équipe
- `RESUME_VALIDATION_FR.md` - Résumé complet du projet
- `CHATBOT_HR_DOCUMENTATION_COMPLETE.md` - Documentation chatbot
- `GOOGLE_CALENDAR_SETUP.md` - Configuration Google Calendar
- `HAND_GESTURE_SETUP.md` - Configuration contrôle gestuel
- `INDEX_DOCUMENTATION.md` - Index de toute la documentation

### Spécifications
- `.kiro/specs/hr-chatbot-rasa/` - Spec du chatbot Rasa
  - `requirements.md` - Exigences
  - `design.md` - Design
  - `tasks.md` - Tâches d'implémentation

### Guides de Test
- `rasa-chatbot/docs/QUICK_TEST_COMMANDS.md`
- `rasa-chatbot/docs/CHECKPOINT_TESTING_GUIDE.md`
- `TEST_GOOGLE_CALENDAR.md`

---

## 🎯 Points Clés pour DevOps

### Services à Conteneuriser
1. **Frontend** (React + Vite)
   - Build: `npm run build`
   - Serveur: Nginx ou serveur statique
   - Port: 5173 (dev) / 80 (prod)

2. **Backend** (NestJS)
   - Build: `npm run build`
   - Démarrage: `node dist/main`
   - Port: 3000
   - Dépendances: MongoDB

3. **AI Service** (Python + FastAPI)
   - Démarrage: `uvicorn main:app`
   - Port: 8000
   - Dépendances: Redis (optionnel)

4. **Rasa Chatbot** (Python + Rasa)
   - Rasa Server: `rasa run --enable-api`
   - Actions Server: `rasa run actions`
   - Ports: 5005, 5055

5. **MongoDB**
   - Port: 27017
   - Volume persistant nécessaire

6. **Redis** (optionnel)
   - Port: 6379

### Variables d'Environnement à Configurer
- Clés API (Google, Anthropic, OpenRouter)
- URLs des services
- Secrets JWT
- Credentials MongoDB
- Credentials Email

### Volumes Persistants
- MongoDB data
- Modèles Rasa entraînés
- Modèles AI Service
- Logs

### Health Checks
- Backend: `GET /health` ou `GET /`
- AI Service: `GET /health`
- Rasa: `GET http://localhost:5005`
- Actions: `GET http://localhost:5055/health`

### Ordre de Démarrage
1. MongoDB
2. Redis (optionnel)
3. Backend
4. AI Service
5. Rasa (Actions + Server)
6. Frontend

---

## 🔧 Configuration CI/CD

### Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build

# AI Service
cd ai-service && pip install -r requirements.txt

# Rasa
cd rasa-chatbot && rasa train
```

### Tests
```bash
# Frontend
cd frontend && npm run test:ci

# Backend
cd backend && npm run test:ci

# AI Service
cd ai-service && pytest

# Rasa
cd rasa-chatbot && rasa test
```

### Déploiement
- Frontend: Build statique → Nginx/CDN
- Backend: Container Node.js
- AI Service: Container Python
- Rasa: Container Python
- MongoDB: Service managé ou container

---

## 📈 Scalabilité

### Services Stateless (faciles à scaler)
- Frontend (statique)
- Backend (API REST)
- AI Service (API REST)
- Rasa Server

### Services Stateful (nécessitent attention)
- MongoDB (réplication)
- Redis (cluster)
- WebSocket (sticky sessions)

### Recommandations
- Load balancer devant Backend
- Cache Redis pour AI Service
- CDN pour Frontend
- MongoDB replica set pour HA

---

## 🐛 Dépannage Courant

### Problème: Services ne communiquent pas
- Vérifier les URLs dans les `.env`
- Vérifier que tous les services sont démarrés
- Vérifier les CORS

### Problème: MongoDB connection failed
- Vérifier que MongoDB est démarré
- Vérifier `MONGODB_URI` dans `.env`

### Problème: Rasa ne répond pas
- Vérifier que les 2 serveurs sont démarrés (Rasa + Actions)
- Vérifier que le modèle est entraîné (`ls models/`)

### Problème: Google Calendar ne fonctionne pas
- Vérifier les credentials Google OAuth
- Faire un hard refresh du navigateur (Ctrl+Shift+R)

---

## 📞 Support et Maintenance

### Logs à Surveiller
- Backend: Logs NestJS
- AI Service: Logs uvicorn
- Rasa: Logs Rasa
- MongoDB: Logs MongoDB
- Nginx: Access logs + Error logs

### Métriques à Monitorer
- Temps de réponse API
- Taux d'erreur
- Utilisation CPU/RAM
- Connexions MongoDB
- Taille de la base de données

---

## ✅ Checklist DevOps

- [ ] Dockerfiles créés pour chaque service
- [ ] docker-compose.yml configuré
- [ ] Variables d'environnement externalisées
- [ ] Secrets sécurisés (pas dans le code)
- [ ] Health checks configurés
- [ ] Volumes persistants définis
- [ ] Réseau Docker configuré
- [ ] CI/CD pipeline configuré
- [ ] Tests automatisés dans CI
- [ ] Monitoring configuré
- [ ] Logs centralisés
- [ ] Backups MongoDB automatisés
- [ ] Documentation déploiement
- [ ] Rollback strategy définie

---

## 🎓 Conclusion

Cette application est une plateforme complète de gestion des compétences avec IA, composée de 4 microservices (Frontend React, Backend NestJS, AI Service Python, Rasa Chatbot) communiquant via REST API et WebSocket.

L'architecture microservices permet une scalabilité horizontale et une maintenance indépendante de chaque service. Les technologies modernes utilisées (React, NestJS, FastAPI, Rasa) sont bien supportées par les outils DevOps standards (Docker, Kubernetes, CI/CD).

Les points d'attention pour le DevOps sont :
- Gestion des secrets (clés API)
- Persistance des données (MongoDB, modèles ML)
- Communication inter-services (réseau Docker)
- Ordre de démarrage des services
- Health checks et monitoring
