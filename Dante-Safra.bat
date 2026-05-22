@echo off
color 0A
title Dante Safra
echo ===================================
echo     INICIANDO DANTE SAFRA
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

start msedge --app=http://localhost:3000/dante-safra || start chrome --app=http://localhost:3000/dante-safra || start http://localhost:3000/dante-safra
exit
