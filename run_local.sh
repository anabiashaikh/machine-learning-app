#!/bin/bash
echo "Starting Backend (FastAPI)..."
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting Frontend (React)..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "Full stack is starting up!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
