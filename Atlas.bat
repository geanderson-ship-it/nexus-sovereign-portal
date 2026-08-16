@echo off
color 0B
title Atlas B2B
echo ===================================
echo     INICIANDO ATLAS B2B
echo ===================================
echo.
cd /d "c:\Users\geand\Gitclone\nexus-sovereign-portal"

netstat -ano | find "LISTENING" | find ":3000" > nul
if %errorlevel% equ 0 (
    echo Servidor ja esta rodando. Conectando...
) else (
    echo Iniciando os servidores do Nexus...
    start /min cmd /c "npm run dev"
    timeout /t 15 /nobreak > nul
)

start msedge --app=http://localhost:3000/gabinete/prospector/atlas || start chrome --app=http://localhost:3000/gabinete/prospector/atlas || start http://localhost:3000/gabinete/prospector/atlas
exit
