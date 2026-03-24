@echo off
echo Starting Backend (FastAPI)...
start cmd /k "pip install -r requirements.txt && uvicorn api:app --host 0.0.0.0 --port 8000"

echo Starting Frontend (React)...
cd frontend
start cmd /k "npm install && npm run dev"

echo Full stack is starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
