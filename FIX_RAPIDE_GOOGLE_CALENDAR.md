# Fix Rapide - Google Calendar "Missing end time"

## 🚨 Problème
Erreur "Missing end time" lors de l'ajout d'une activité au Google Calendar.

## ✅ Solution en 3 étapes

### Étape 1: Redémarrer le backend
```cmd
cd backend
npm run start:dev
```

### Étape 2: Vider le cache du navigateur
**TRÈS IMPORTANT** - Le navigateur utilise l'ancienne version du code!

**Windows/Linux**: 
```
Ctrl + Shift + R
```

**Mac**:
```
Cmd + Shift + R
```

**Alternative**: Ouvrir une fenêtre de navigation privée

### Étape 3: Tester
1. Se connecter en tant qu'employé
2. Aller sur "Mes activités"
3. Connecter Google Calendar (si pas déjà fait)
4. Accepter une activité
5. Vérifier dans la console (F12) que ces logs apparaissent:

```
🔍 Vérification Google Calendar: { isConnected: true, hasStartDate: true, ... }
📋 Données de l'activité reçues: { ... }
📅 Dates de l'événement: { start: "...", end: "..." }
📤 Événement à envoyer à Google Calendar: { ... }
✅ Événement créé dans Google Calendar
```

## 🔍 Si ça ne marche toujours pas

### Les logs n'apparaissent pas?
→ Cache pas vidé, essayer en navigation privée

### startDate est null dans les logs?
→ L'activité n'a pas de date, créer une nouvelle activité avec une date

### Erreur 401?
→ Token Google expiré, se déconnecter et reconnecter Google Calendar

### Toujours "Missing end time"?
→ Vérifier que le backend a bien redémarré avec la nouvelle version

## 📝 Changements appliqués

### Backend
Ajout de `startDate` et `endDate` dans la réponse API:
```typescript
.populate('activityId', 'titre title date startDate endDate location description')
```

### Frontend
Utilisation de `startDate` au lieu de `date`:
```typescript
start_date: r?.activityId?.startDate ? String(r.activityId.startDate) : ...
end_date: r?.activityId?.endDate ? String(r.activityId.endDate) : null
```

## ✨ Résultat attendu
L'activité acceptée doit apparaître dans Google Calendar avec:
- Titre de l'activité
- Description
- Date et heure de début
- Date et heure de fin (début + 2h si non spécifiée)
- Lieu (si défini)
