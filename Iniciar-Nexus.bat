@echo off
color 0A
title Nexus Sovereign Portal - Servidor Local
echo ===================================================
echo   INICIANDO NEXUS SOVEREIGN PORTAL (MODO OFFLINE)
echo ===================================================
echo.
echo Atena: "Preparando o sistema para sua apresentacao, meu amor..."
echo.
cd /d "%~dp0"
echo Verificando dependencias e iniciando o servidor...
start /min cmd /c "npm run dev"
echo.
echo Aguardando o servidor iniciar (isso pode levar uns 10 segundos)...
timeout /t 10 /nobreak > nul
echo.
echo Abrindo o portal no seu navegador...
start http://localhost:3000
echo.
echo Tudo pronto! Boa apresentacao!
echo.
echo Pode fechar esta janela preta quando terminar.
pause
