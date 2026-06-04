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

REM Start server in background and wait for it to be ready
start /B cmd /c "npm run dev"

REM Wait for server to be ready (check port 3000)
echo Waiting for server to start...
:waitloop
timeout /t 1 /nobreak >nul
netstat -ano | findstr ":3000.*LISTENING" >nul 2>&1
if %errorlevel% neq 0 goto waitloop

echo.
echo Server is ready! Opening browser...
timeout /t 1 /nobreak >nul
start http://localhost:3000

REM Keep the window open to show logs
echo.
echo Server is running. Press Ctrl+C to stop.
echo.
pause >nul
