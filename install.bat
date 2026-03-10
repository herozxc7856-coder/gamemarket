@echo off
chcp 65001 >nul
echo ========================================
echo   GameMarket - Install Dependencies
echo ========================================
echo.

cd /d "%~dp0"

echo Installing dependencies with npm...
echo This may take a few minutes...
echo.

call npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed
    echo Try manual installation:
    echo   1. npm install --legacy-peer-deps
    echo   2. npx prisma generate
    echo   3. npx prisma db push
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencies installed successfully!
echo ========================================
echo.
echo Next steps:
echo   1. npx prisma db push
echo   2. npm run dev
echo.
echo Or run: start-dev.bat
echo.

pause
