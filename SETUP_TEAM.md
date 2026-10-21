# Configuration pour l'équipe

## Après un `git pull`, suivez ces étapes:

### 1. Backend Setup

```bash
cd backend
cp env.example .env
```

Puis modifiez `backend/.env` avec VOS propres clés:

- **MongoDB**: Utilisez votre instance locale `mongodb://localhost:27017/employee-recommendation-system`
- **JWT_SECRET**: Gardez celui par défaut ou générez le vôtre
- **OPENROUTER_API_KEY**: Utilisez la clé partagée ou créez la vôtre sur https://openrouter.ai
- **GOOGLE_CLIENT_ID/SECRET**: Demandez les clés à l'équipe ou créez les vôtres
- **MAIL_USER/PASS**: Utilisez votre Gmail + App Password
- **ANTHROPIC_API_KEY**: Optionnel, pour le service AI

### 2. Frontend Setup

```bash
cd frontend
```

Créez `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=votre_client_id
VITE_GOOGLE_API_KEY=votre_api_key
VITE_API_URL=http://localhost:3000
```

### 3. Services à lancer

```bash
# MongoDB
mongod

# Backend (terminal 1)
cd backend
npm install
npm start

# Frontend (terminal 2)
cd frontend
npm install
npm run dev

# AI Service (terminal 3 - optionnel)
cd ai-service
pip install -r requirements.txt
python main.py

# Rasa (terminal 4 - optionnel)
cd rasa-chatbot
rasa run --enable-api --cors "*"
```

## Clés API partagées (à demander à l'équipe)

- OpenRouter API Key: `sk-or-v1-...` (déjà dans env.example)
- Google OAuth Client ID: Demander à l'admin
- Google OAuth Secret: Demander à l'admin

## Notes importantes

- **NE JAMAIS** commiter les fichiers `.env`
- Chaque membre doit avoir son propre `.env` local
- Les clés API sensibles doivent être partagées via un canal sécurisé (pas Git!)
