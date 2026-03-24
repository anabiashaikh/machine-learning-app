import streamlit as st
import pandas as pd
import numpy as np
import pickle
import os

# Set page configuration
st.set_page_config(
    page_title="AI Predictive Maintenance",
    page_icon="⚙️",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS for modern aesthetics
st.markdown("""
<style>
    /* Main background */
    .stApp {
        background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
        color: #c9d1d9;
    }
    
    /* Input fields and boxes */
    .stTextInput>div>div>input, .stNumberInput>div>div>input, .stSelectbox>div>div>div {
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 8px;
    }
    
    /* Text labels */
    label {
        color: #8b949e !important;
        font-weight: 500 !important;
    }
    
    /* Button */
    .stButton>button {
        width: 100%;
        background: linear-gradient(90deg, #ff7a18, #af002d 50%, #319197 100%);
        background-size: 200% auto;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: 0.5s;
        box-shadow: 0 4px 15px rgba(175, 0, 45, 0.4);
    }
    
    .stButton>button:hover {
        background-position: right center;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(175, 0, 45, 0.6);
        color: white;
    }
    
    /* Title */
    .title-box {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        padding: 30px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        text-align: center;
        margin-bottom: 30px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    
    .title-text {
        background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.8em;
        font-weight: 800;
        margin-bottom: 5px;
        letter-spacing: -1px;
    }
    
    .subtitle-text {
        color: #8b949e;
        font-size: 1.1em;
        font-weight: 400;
    }
    
    /* Divider */
    hr {
        border-color: rgba(255,255,255,0.1);
    }
</style>
""", unsafe_allow_html=True)

# Application Header
st.markdown("""
<div class="title-box">
    <div class="title-text">Predictive Maintenance</div>
    <div class="subtitle-text">AI-Powered Machine Failure Prediction System</div>
</div>
""", unsafe_allow_html=True)

# Load Models
@st.cache_resource
def load_models():
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pkl')
    scaler_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scaler.pkl')
    
    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        with open(scaler_path, "rb") as f:
            scaler = pickle.load(f)
        return model, scaler
    except FileNotFoundError:
        st.error("Error: Model files not found. Please run train.py first to generate model.pkl and scaler.pkl.")
        return None, None

model, scaler = load_models()

if model is not None and scaler is not None:
    st.markdown("### 📊 Enter Machine Parameters")
    
    col1, col2 = st.columns(2)
    
    with col1:
        machine_type = st.selectbox("Machine Type", options=["L", "M", "H"], help="L: Low, M: Medium, H: High quality")
        air_temp = st.number_input("Air temperature [K]", min_value=200.0, max_value=400.0, value=298.1, step=0.1)
        process_temp = st.number_input("Process temperature [K]", min_value=200.0, max_value=400.0, value=308.6, step=0.1)

    with col2:
        rotational_speed = st.number_input("Rotational speed [rpm]", min_value=0, max_value=5000, value=1551, step=1)
        torque = st.number_input("Torque [Nm]", min_value=0.0, max_value=200.0, value=42.8, step=0.1)
        tool_wear = st.number_input("Tool wear [min]", min_value=0, max_value=500, value=0, step=1)
    
    st.write("---")
    
    # Map Type
    type_map = {"L": 0, "M": 1, "H": 2}
    encoded_type = type_map[machine_type]

    if st.button("Predict Failure Probability"):
        with st.spinner("Analyzing machine telemetry..."):
            features = [[encoded_type, air_temp, process_temp, rotational_speed, torque, tool_wear]]
            features_scaled = scaler.transform(features)
            
            # Predict probability of class 1 (Target=1)
            prob = model.predict_proba(features_scaled)[0][1] * 100
            
            st.markdown("### 📈 Prediction Results")
            if prob > 50:
                st.error(f"⚠️ **High Risk of Failure**: {prob:.2f}%")
                st.progress(int(prob) / 100)
                st.markdown("Please schedule immediate maintenance for this machine.")
            elif prob > 15:
                st.warning(f"⚡ **Moderate Risk of Failure**: {prob:.2f}%")
                st.progress(int(prob) / 100)
                st.markdown("Monitor this machine closely. Consider scheduling preventative maintenance.")
            else:
                st.success(f"✅ **Low Risk of Failure**: {prob:.2f}%")
                st.progress(int(prob) / 100)
                st.markdown("This machine is operating within normal parameters.")
