@echo off
chcp 65001 >nul
echo ========================================
echo   GameMarket - Startup Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking for Bun...
where bun >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Bun is not installed!
    echo.
    echo Please install Bun first:
    echo   1. Open PowerShell
    echo   2. Run: powershell -c "irm bun.sh/install.ps1 | iex"
    echo   3. Restart this script
    echo.
    pause
    exit /b 1
) else (
    echo OK: Bun found
)

echo.
echo [2/4] Installing dependencies...
call bun install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Setting up database...
call bunx prisma db push
if %errorlevel% neq 0 (
    echo WARNING: Database setup failed (will retry on next run)
)

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo   Server: http://localhost:3000
echo   Sell:   http://localhost:3000/sell
echo   Press Ctrl+C to stop
echo ========================================
echo.

call bun run dev

pause
