@echo off
chcp 65001 >nul
echo ========================================
echo   GameMarket - Quick Start (No Prisma)
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Installing dependencies with npm...
call npm install --legacy-peer-deps --ignore-scripts
if %errorlevel% neq 0 (
    echo ERROR: Installation failed
    pause
    exit /b 1
)

echo.
echo [2/3] Generating Prisma client (optional)...
echo Skipping for quick start...

echo.
echo [3/3] Starting development server...
echo.
echo ========================================
echo   Server: http://localhost:3000
echo   Sell:   http://localhost:3000/sell
echo   Press Ctrl+C to stop
echo ========================================
echo.

call npm run dev

pause
