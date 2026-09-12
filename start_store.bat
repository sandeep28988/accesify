@echo off
title ACCESSIFY Store Server
echo ===================================================
echo   Starting ACCESSIFY Store (205 Products + WhatsApp)
echo ===================================================
echo.
echo Local Computer: http://localhost:3000
echo.
start http://localhost:3000
node server.js
pause
