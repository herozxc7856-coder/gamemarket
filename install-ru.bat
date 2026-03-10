@echo off
chcp 65001 >nul
echo ========================================
echo   GameMarket - Install (Russia Mirror)
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Setting up Russian npm mirror...
npm config set registry https://registry.npmmirror.com

echo.
echo [2/5] Cleaning cache...
npm cache clean --force

echo.
echo [3/5] Removing old node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo Old node_modules removed
) else (
    echo No old node_modules found
)

echo.
echo [4/5] Installing dependencies (this may take 5-10 minutes)...
echo Using mirror: registry.npmmirror.com
echo.

npm install --legacy-peer-deps --ignore-scripts --timeout=300000

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   ERROR: Installation failed
    echo ========================================
    echo.
    echo Try manual installation:
    echo   1. npm config set registry https://registry.npmmirror.com
    echo   2. npm cache clean --force
    echo   3. rmdir /s /q node_modules
    echo   4. npm install --legacy-peer-deps --ignore-scripts
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo   Dependencies installed successfully!
echo ========================================
echo.
echo Next steps:
echo   1. npm run dev
echo.
echo Or run: start-quick.bat
echo.

pause
