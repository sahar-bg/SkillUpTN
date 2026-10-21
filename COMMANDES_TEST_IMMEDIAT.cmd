@echo off
echo ========================================
echo TEST IMMEDIAT - Google Calendar Fix
echo ========================================
echo.

echo [1/3] Demarrage du backend...
echo.
start cmd /k "cd backend && npm run start:dev"
timeout /t 5 /nobreak >nul

echo [2/3] Demarrage du frontend...
echo.
start cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo [3/3] Instructions de test:
echo.
echo 1. Attendre que le backend et frontend soient prets
echo 2. Ouvrir le navigateur sur http://localhost:5173
echo 3. IMPORTANT: Faire Ctrl+Shift+R pour vider le cache
echo 4. Se connecter en tant qu'employe
echo 5. Aller dans "Mes activites"
echo 6. Connecter Google Calendar
echo 7. Ouvrir la console (F12)
echo 8. Accepter une activite
echo 9. Verifier les logs dans la console
echo.
echo Logs attendus:
echo   - Verification Google Calendar: { isConnected: true, ... }
echo   - Donnees de l'activite recues: { ... }
echo   - Dates de l'evenement: { start: "...", end: "..." }
echo   - Evenement a envoyer a Google Calendar: { ... }
echo   - Evenement cree dans Google Calendar
echo.
echo 10. Verifier dans Google Calendar que l'evenement est cree
echo.
echo ========================================
echo Si ca ne marche pas:
echo   - Faire Ctrl+Shift+R dans le navigateur
echo   - Ou ouvrir en navigation privee
echo ========================================
echo.
pause
