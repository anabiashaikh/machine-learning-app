from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import os
import pandas as pd
import sqlite3
import hashlib
import secrets

app = FastAPI(title="Predictive Maintenance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SQLite Database Setup for Users ---
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def hash_password(password: str, salt: str) -> str:
    # Use SHA-256 with the unique user salt to hash passwords securely
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

# --- Auth Models & Endpoints ---
class UserAuth(BaseModel):
    email: str
    password: str

@app.post("/register")
def register(user: UserAuth):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT email FROM users WHERE email=?", (user.email,))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")
    
    salt = secrets.token_hex(16)
    pwd_hash = hash_password(user.password, salt)
    
    c.execute("INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)", 
              (user.email, pwd_hash, salt))
    conn.commit()
    conn.close()
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserAuth):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT password_hash, salt FROM users WHERE email=?", (user.email,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    stored_hash, salt = row
    if hash_password(user.password, salt) != stored_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return {"message": "Login successful"}

# --- ML Models ---
try:
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pkl')
    scaler_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scaler.pkl')
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    scaler = None

class SensorData(BaseModel):
    machine_type: str
    air_temp: float
    process_temp: float
    rotational_speed: float
    torque: float
    tool_wear: float

@app.post("/predict")
def predict_failure(data: SensorData):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Machine learning models are not loaded.")
    type_map = {"L": 0, "M": 1, "H": 2}
    if data.machine_type not in type_map:
        raise HTTPException(status_code=400, detail="Invalid machine_type")
    
    encoded_type = type_map[data.machine_type]
    
    features_df = pd.DataFrame(
        [[encoded_type, data.air_temp, data.process_temp, data.rotational_speed, data.torque, data.tool_wear]],
        columns=['Type', 'Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]']
    )
    
    try:
        features_scaled = scaler.transform(features_df)
        prob = model.predict_proba(features_scaled)[0][1] * 100
        return {"failure_probability_percent": prob}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
def get_alerts():
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'predictive_maintenance.csv')
    try:
        df = pd.read_csv(csv_path)
        recent_history = df.tail(10).to_dict(orient="records")
        failures = df[df['Target'] == 1].tail(50).to_dict(orient="records")
        
        formatted_alerts = []
        for row in failures:
            formatted_alerts.append({
                "id": f"AL-{row['UDI']}",
                "machineId": row['Product ID'],
                "issue": row['Failure Type'],
                "timestamp": f"Log Run #{row['UDI']}",
                "severity": "critical" if row['Failure Type'] in ['Power Failure', 'Overstrain Failure', 'Tool Wear Failure'] else "warning"
            })
            
        formatted_history = []
        for row in recent_history:
             formatted_history.append({
                  "message": f"Cycle logged for {row['Product ID']} (Temp: {row['Air temperature [K]']}K, RPM: {row['Rotational speed [rpm]']})",
                  "time": f"Log Run #{row['UDI']}",
                  "status": "critical" if row['Target'] == 1 else "good"
             })
             
        formatted_alerts.reverse()
        formatted_history.reverse()
        
        return {"alerts": formatted_alerts, "history": formatted_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
