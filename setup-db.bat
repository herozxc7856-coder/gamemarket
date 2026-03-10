@echo off
chcp 65001 >nul
echo ========================================
echo   GameMarket - Database Setup
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo WARNING: Prisma generate failed, continuing...
)

echo.
echo [2/4] Updating database schema...
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo WARNING: Database push failed, continuing...
)

echo.
echo [3/4] Seeding test data...
call node scripts/setup-db.js
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   WARNING: Seeding failed
    echo ========================================
    echo.
    echo Try manual fix:
    echo   1. Check VPN is ON
    echo   2. Run: node scripts/setup-db.js
    echo   3. Or use minimal mode (README_MINIMAL.md)
    echo.
)

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo   Next: npm run dev
echo   Site: http://localhost:3000
echo ========================================
echo.

pause
