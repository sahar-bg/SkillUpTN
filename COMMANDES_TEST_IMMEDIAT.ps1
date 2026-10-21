Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST IMMEDIAT - Google Calendar Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Demarrage du backend..." -ForegroundColor Yellow
Write-Host ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"
Start-Sleep -Seconds 5

Write-Host "[2/3] Demarrage du frontend..." -ForegroundColor Yellow
Write-Host ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Start-Sleep -Seconds 5

Write-Host "[3/3] Instructions de test:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Attendre que le backend et frontend soient prets" -ForegroundColor White
Write-Host "2. Ouvrir le navigateur sur http://localhost:5173" -ForegroundColor White
Write-Host "3. IMPORTANT: Faire Ctrl+Shift+R pour vider le cache" -ForegroundColor Red
Write-Host "4. Se connecter en tant qu'employe" -ForegroundColor White
Write-Host "5. Aller dans 'Mes activites'" -ForegroundColor White
Write-Host "6. Connecter Google Calendar" -ForegroundColor White
Write-Host "7. Ouvrir la console (F12)" -ForegroundColor White
Write-Host "8. Accepter une activite" -ForegroundColor White
Write-Host "9. Verifier les logs dans la console" -ForegroundColor White
Write-Host ""
Write-Host "Logs attendus:" -ForegroundColor Green
Write-Host "  - Verification Google Calendar: { isConnected: true, ... }" -ForegroundColor Gray
Write-Host "  - Donnees de l'activite recues: { ... }" -ForegroundColor Gray
Write-Host "  - Dates de l'evenement: { start: '...', end: '...' }" -ForegroundColor Gray
Write-Host "  - Evenement a envoyer a Google Calendar: { ... }" -ForegroundColor Gray
Write-Host "  - Evenement cree dans Google Calendar" -ForegroundColor Gray
Write-Host ""
Write-Host "10. Verifier dans Google Calendar que l'evenement est cree" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Si ca ne marche pas:" -ForegroundColor Red
Write-Host "  - Faire Ctrl+Shift+R dans le navigateur" -ForegroundColor Yellow
Write-Host "  - Ou ouvrir en navigation privee" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuyez sur Entree pour continuer"
