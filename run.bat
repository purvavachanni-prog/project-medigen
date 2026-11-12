@echo off
echo =====================================================================
echo   PROJECT MEDIGEN: Intelligent Clinical Decision Support Platform
echo   Indian Healthcare Hackathon Edition
echo =====================================================================
echo.
echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
start "MEDIGEN FastAPI Backend" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
npm.cmd run dev

pause

