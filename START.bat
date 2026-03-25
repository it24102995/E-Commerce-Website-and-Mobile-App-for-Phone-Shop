@echo off
REM E-Commerce Project Starter Script
REM This script helps you start both backend and frontend services

setlocal enabledelayedexpansion

echo ======================================================
echo   E-Commerce Application - Quick Start
echo ======================================================
echo.

REM Check if we're in the correct directory
if not exist "pom.xml" (
    echo ERROR: pom.xml not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [1] Start Backend (Spring Boot on port 8081)
echo [2] Start Frontend (Vite React on port 5173)
echo [3] Start Both (2 new terminals)
echo [4] View Testing Guide
echo [5] Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Starting Backend...
    echo.
    mvn spring-boot:run
    pause
    exit /b 0
)

if "%choice%"=="2" (
    echo.
    echo Starting Frontend...
    echo.
    cd frontend
    if not exist "node_modules" (
        echo Installing dependencies...
        call npm install
    )
    call npm run dev
    pause
    exit /b 0
)

if "%choice%"=="3" (
    echo.
    echo Starting Backend in new terminal...
    start cmd /k "cd %cd% && mvn spring-boot:run"
    
    timeout /t 3 /nobreak
    
    echo Starting Frontend in new terminal...
    cd frontend
    if not exist "node_modules" (
        start cmd /k "cd %cd% && npm install && npm run dev"
    ) else (
        start cmd /k "cd %cd% && npm run dev"
    )
    
    cd ..
    
    echo.
    echo ======================================================
    echo   Services Starting...
    echo   Backend:  http://localhost:8081
    echo   Frontend: http://localhost:5173
    echo ======================================================
    echo.
    pause
    exit /b 0
)

if "%choice%"=="4" (
    if exist "TESTING_GUIDE.md" (
        start notepad TESTING_GUIDE.md
    ) else (
        echo Testing guide not found!
    )
    pause
    exit /b 0
)

if "%choice%"=="5" (
    exit /b 0
)

echo Invalid choice. Exiting.
pause
exit /b 1
