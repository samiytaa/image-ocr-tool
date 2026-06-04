@echo off
title Image OCR Tool
color 0A

echo ========================================
echo    Image OCR Tool - Startup
echo ========================================
echo.

REM Check if dependencies exist
if not exist "node_modules\" (
    echo [Step 1/2] Installing dependencies...
    echo This will take a few minutes, please wait...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo.
        echo ERROR: Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
) else (
    echo [OK] Dependencies already installed
    echo.
)

REM Start the development server
echo [Step 2/2] Starting development server...
echo.
echo ========================================
echo  Server will start at: 
echo  http://localhost:3000
echo.
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

REM Open browser after a short delay (without opening new window)
powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"

call npm run dev

REM This will only run if npm run dev exits
echo.
echo.
echo Server has stopped.
pause
