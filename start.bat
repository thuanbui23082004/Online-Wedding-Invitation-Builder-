@echo off
echo Starting WeddingCraft...
start cmd /k "cd /d "%~dp0wedding-backend" && npm run start:dev"
start cmd /k "cd /d "%~dp0wedding-frontend" && npm run dev"
timeout /t 3
start http://localhost:5173