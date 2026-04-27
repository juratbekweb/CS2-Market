@echo off
echo Starting original CS2 Marketplace frontend...
echo.
echo Frontend will run from the old project version in /CS2-Market
echo Default URL: http://localhost:3003
echo.
cd /d %~dp0CS2-Market
npm run dev
pause
