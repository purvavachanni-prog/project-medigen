#!/bin/bash
echo "====================================================================="
echo "  PROJECT MEDIGEN: Intelligent Clinical Decision Support Platform"
echo "  Indian Healthcare Hackathon Edition"
echo "====================================================================="
echo ""

echo "[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "[2/2] Starting Vite Frontend on http://localhost:5173 ..."
npm run dev &
FRONTEND_PID=$!

function cleanup {
  echo "Stopping MEDIGEN servers..."
  kill $BACKEND_PID $FRONTEND_PID
}
trap cleanup EXIT

wait

