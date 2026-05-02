# Fix Google Calendar - Problème "Missing end time"

## Problème
L'erreur "Missing end time" apparaît lors de l'ajout d'une activité au Google Calendar.

## Cause
Le backend ne retournait pas les champs `startDate` et `endDate` dans la réponse API, seulement le champ optionnel `date`.

## Solution appliquée

### 1. Backend - Ajout des champs manquants
**Fichier**: `backend/src/recommendations/recommendation.service.ts`

Modification de la méthode `getMyRecommendations`:
```typescript
async getMyRecommendations(employeeId: string) {
  return this.recommendationModel
    .find({ userId: new Types.ObjectId(employeeId) })
    .populate('activityId', 'titre title date startDate endDate location description') // ✅ Ajout de startDate et endDate
    .sort({ created_at: -1 })
    .exec()
}
```

### 2. Frontend - Correction du mapping
**Fichier**: `frontend/src/pages/employee/EmployeeActivities.tsx`

Modification du mapping des données:
```typescript
start_date: r?.activityId?.startDate ? String(r.activityId.startDate) : (r?.activityId?.date ? String(r.activityId.date) : null),
end_date: r?.activityId?.endDate ? String(r.activityId.endDate) : null,
```

Priorité: `startDate` > `date` > `null`

## Test de la correction

### Étape 1: Redémarrer le backend
```cmd
cd backend
npm run start:dev
```

### Étape 2: Vider le cache du navigateur
**IMPORTANT**: Le navigateur peut avoir mis en cache l'ancienne version du code.

**Option 1 - Hard Refresh (Recommandé)**:
- Windows/Linux: `Ctrl + Shift + R` ou `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Option 2 - Vider le cache manuellement**:
1. Ouvrir DevTools (F12)
2. Clic droit sur le bouton de rafraîchissement
3. Sélectionner "Vider le cache et actualiser de force"

**Option 3 - Mode navigation privée**:
- Ouvrir une fenêtre de navigation privée
- Tester l'application

### Étape 3: Vérifier les logs
Ouvrir la console du navigateur (F12) et chercher ces logs lors de l'acceptation d'une activité:

```
🔍 Vérification Google Calendar: { isConnected: true, hasStartDate: true, ... }
📋 Données de l'activité reçues: { title: "...", startDate: "...", endDate: "..." }
📅 Dates de l'événement: { start: "2026-04-15T10:00:00.000Z", end: "2026-04-15T12:00:00.000Z" }
📤 Événement à envoyer à Google Calendar: { summary: "...", start: {...}, end: {...} }
📅 Création de l'événement dans Google Calendar...
✅ Événement créé dans Google Calendar: { ... }
```

### Étape 4: Tester l'ajout au calendrier
1. Se connecter en tant qu'employé
2. Aller sur "Mes activités"
3. Connecter Google Calendar (bouton en haut)
4. Accepter une activité
5. Vérifier que l'événement apparaît dans Google Calendar

## Vérification de la structure des données

### Backend - Schéma Activity
```typescript
@Prop({ required: true })
startDate: Date;

@Prop()
date?: Date; // Optionnel, pour compatibilité

@Prop({ required: true })
endDate: Date;
```

### Frontend - Type EmployeeRecommendation
```typescript
type EmployeeRecommendation = {
  start_date: string | null;
  end_date: string | null;
  // ...
}
```

## Logs de débogage

Si le problème persiste, vérifier ces points:

1. **Les logs n'apparaissent pas**: Cache navigateur non vidé
2. **startDate est null**: L'activité n'a pas de date définie dans la BD
3. **Erreur 401**: Token Google expiré, se reconnecter
4. **Erreur 400 "Missing end time"**: Le mapping des dates est incorrect

## Commandes utiles

### Vérifier une activité dans MongoDB
```javascript
db.activities.findOne({ _id: ObjectId("...") })
```

### Vérifier une recommandation
```javascript
db.recommendations.findOne({ _id: ObjectId("...") }).populate('activityId')
```

## Notes importantes

- Les champs `startDate` et `endDate` sont **requis** dans le schéma Activity
- Le champ `date` est **optionnel** et utilisé pour compatibilité
- Le frontend utilise `startDate` en priorité, puis `date` en fallback
- Si `endDate` n'est pas fourni, le service ajoute automatiquement 2 heures à `startDate`
