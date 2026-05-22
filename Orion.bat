@echo off
color 09
title Orion OS
echo ===================================
echo     INICIANDO ORION OS
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

start msedge --app=http://localhost:3000/intelligence/orion-os || start chrome --app=http://localhost:3000/intelligence/orion-os || start http://localhost:3000/intelligence/orion-os
exit
