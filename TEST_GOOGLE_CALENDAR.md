# Test Google Calendar - Guide complet

## Prérequis
- Backend démarré sur port 3000
- Frontend démarré sur port 5173
- MongoDB en cours d'exécution
- Compte Google avec accès à Google Calendar

## Étape 1: Créer une activité de test (RH)

### Se connecter en tant que RH
1. Aller sur http://localhost:5173
2. Se connecter avec un compte RH
3. Aller dans "Activités" → "Créer une activité"

### Créer l'activité
```
Titre: Formation Test Google Calendar
Description: Test de l'intégration Google Calendar
Type: Formation
Département: IT
Date de début: [Choisir une date future, ex: 15/04/2026 10:00]
Date de fin: [Choisir 2h après, ex: 15/04/2026 12:00]
Lieu: Salle de formation A
Participants max: 10
Compétences requises: [Ajouter quelques compétences]
```

### Générer des recommandations
1. Cliquer sur "Générer des recommandations IA"
2. Valider les recommandations
3. Notifier les managers

## Étape 2: Confirmer en tant que Manager

### Se connecter en tant que Manager
1. Se déconnecter du compte RH
2. Se connecter avec un compte Manager
3. Aller dans "Recommandations"

### Confirmer les participants
1. Voir la liste des employés recommandés
2. Confirmer au moins 1 employé
3. Les employés confirmés reçoivent une notification

## Étape 3: Tester Google Calendar (Employé)

### Se connecter en tant qu'Employé
1. Se déconnecter du compte Manager
2. Se connecter avec le compte de l'employé confirmé
3. Aller dans "Mes activités"

### Connecter Google Calendar
1. Cliquer sur le bouton "Connecter Google Calendar"
2. Autoriser l'accès à Google Calendar
3. Vérifier que le statut affiche "Connecté"

### Ouvrir la console du navigateur
**IMPORTANT**: Ouvrir la console AVANT d'accepter l'activité
1. Appuyer sur F12
2. Aller dans l'onglet "Console"
3. Garder la console ouverte

### Accepter l'activité
1. Cliquer sur le bouton vert "Accepter" (icône ✓)
2. Observer les logs dans la console

## Logs attendus

### ✅ Logs de succès
```
🔍 Vérification Google Calendar: {
  isConnected: true,
  hasStartDate: true,
  startDate: "2026-04-15T10:00:00.000Z",
  endDate: "2026-04-15T12:00:00.000Z",
  rec: { ... }
}

📋 Données de l'activité reçues: {
  title: "Formation Test Google Calendar",
  description: "Test de l'intégration Google Calendar",
  startDate: "2026-04-15T10:00:00.000Z",
  endDate: "2026-04-15T12:00:00.000Z",
  location: "Salle de formation A"
}

📅 Dates de l'événement: {
  start: "2026-04-15T10:00:00.000Z",
  end: "2026-04-15T12:00:00.000Z"
}

📤 Événement à envoyer à Google Calendar: {
  "summary": "Formation Test Google Calendar",
  "description": "Test de l'intégration Google Calendar",
  "location": "Salle de formation A",
  "start": {
    "dateTime": "2026-04-15T10:00:00.000Z",
    "timeZone": "Europe/Paris"
  },
  "end": {
    "dateTime": "2026-04-15T12:00:00.000Z",
    "timeZone": "Europe/Paris"
  }
}

📅 Création de l'événement dans Google Calendar...

✅ Événement créé dans Google Calendar: { id: "...", ... }
```

### ✅ Toast de succès
Un message de confirmation doit apparaître:
```
Présence confirmée
Activité ajoutée à votre calendrier Google ✓
```

## Vérification dans Google Calendar

### Ouvrir Google Calendar
1. Aller sur https://calendar.google.com
2. Se connecter avec le même compte Google
3. Chercher l'événement à la date choisie

### Vérifier l'événement
L'événement doit contenir:
- ✅ Titre: "Formation Test Google Calendar"
- ✅ Description: "Test de l'intégration Google Calendar"
- ✅ Date: 15/04/2026
- ✅ Heure de début: 10:00
- ✅ Heure de fin: 12:00
- ✅ Lieu: "Salle de formation A"

## Problèmes courants

### ❌ Logs n'apparaissent pas
**Cause**: Cache du navigateur
**Solution**: 
1. Faire Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
2. Ou ouvrir en navigation privée

### ❌ startDate est null
**Cause**: L'activité n'a pas de date définie
**Solution**: 
1. Vérifier que l'activité a bien une date de début et de fin
2. Recréer l'activité si nécessaire

### ❌ Erreur "Missing end time"
**Cause**: Ancienne version du code
**Solution**:
1. Redémarrer le backend
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Réessayer

### ❌ Erreur 401 Unauthorized
**Cause**: Token Google expiré
**Solution**:
1. Cliquer sur "Déconnecter Google Calendar"
2. Reconnecter Google Calendar
3. Réessayer

### ❌ Bouton "Connecter Google Calendar" ne fonctionne pas
**Cause**: Clés API Google non configurées
**Solution**:
1. Vérifier que `frontend/.env` contient:
   ```
   VITE_GOOGLE_CLIENT_ID=...
   VITE_GOOGLE_API_KEY=...
   ```
2. Redémarrer le frontend

## Test de régression

### Scénario 1: Activité sans date de fin
1. Créer une activité avec seulement une date de début
2. Accepter l'activité
3. Vérifier que la date de fin est automatiquement calculée (+2h)

### Scénario 2: Déconnexion Google
1. Accepter une activité sans être connecté à Google
2. Vérifier que le toast affiche "Votre confirmation a été envoyée" (sans mention du calendrier)

### Scénario 3: Refus d'activité
1. Refuser une activité
2. Vérifier qu'elle n'est PAS ajoutée au calendrier

## Commandes de débogage

### Vérifier une activité dans MongoDB
```javascript
use employee-recommendation-system
db.activities.findOne({ title: "Formation Test Google Calendar" })
```

### Vérifier une recommandation
```javascript
db.recommendations.findOne({ status: "NOTIFIED" }).populate('activityId')
```

### Vérifier les logs backend
```cmd
cd backend
npm run start:dev
# Observer les logs dans le terminal
```

## Résultat attendu final

✅ L'activité acceptée apparaît dans Google Calendar
✅ Tous les détails sont corrects (titre, description, dates, lieu)
✅ Les logs de débogage s'affichent correctement
✅ Le toast de confirmation s'affiche
✅ L'activité disparaît de la liste "Mes activités"
