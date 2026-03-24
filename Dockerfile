FROM python:3.10-slim

WORKDIR /app

# Ensure tzdata and other dependencies are up to date if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY api.py .
COPY model.pkl .
COPY scaler.pkl .
COPY predictive_maintenance.csv .
COPY users.db .

# Expose FastAPI port
EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
