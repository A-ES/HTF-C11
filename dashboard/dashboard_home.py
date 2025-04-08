import streamlit as st
import pandas as pd
import plotly.express as px
import pickle
import os

# Set page config
st.set_page_config(page_title="Smart Construction Dashboard", layout="wide", initial_sidebar_state="expanded")

# ---------- Load Dataset ----------
@st.cache_data
def load_data():
    return pd.read_csv("data/Construction_Dataset.csv")

df = load_data()

# ---------- Load Model ----------
@st.cache_resource
def load_model(path):
    with open(path, "rb") as file:
        return pickle.load(file)

model_path = os.path.join("..", "artifacts", "model.pkl")
model = load_model(model_path) if os.path.exists(model_path) else None
if not model:
    st.warning("Model not found. Please train your model first.")

# ---------- Sidebar Navigation ----------
st.sidebar.title("📊 Vatican Cameos")
st.sidebar.markdown("### Navigation")
menu = st.sidebar.radio("", ["Dashboard", "AI Recommendations", "Risk Analysis", "Settings"])

# ---------- Main Dashboard ----------
if menu == "Dashboard":
    st.markdown(
        """<style>body, .stApp { background-color: #121212; color: white; }
        .card { background-color: #1e1e1e; padding: 20px; border-radius: 12px; color: white; margin-bottom: 20px; box-shadow: 0px 0px 10px rgba(0,0,0,0.3); }
        </style>""",
        unsafe_allow_html=True
    )

    st.title("📍 Dashboard")
    st.subheader("Smart Resource Optimization for Efficient Construction Management")

    # Display Overview Cards using dataset insights
    avg_resource = df['Resource Allocation Efficiency'].mean()
    time_eff = df['Schedule Optimization'].mean()
    cost = df['Best Cost'].mean()

    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f"<div class='card'><h4>Avg Resource Efficiency</h4><h2>{avg_resource:.2f}%</h2></div>", unsafe_allow_html=True)
    with col2:
        st.markdown(f"<div class='card'><h4>Avg Schedule Optimization</h4><h2>{time_eff:.2f}%</h2></div>", unsafe_allow_html=True)
    with col3:
        st.markdown(f"<div class='card'><h4>Avg Project Cost</h4><h2>${cost:,.0f}</h2></div>", unsafe_allow_html=True)

    st.markdown("---")

    # Timeline Chart
    st.subheader("📅 Sample Project Timeline")
    timeline = pd.DataFrame({
        "Phase": ["Site Preparation", "Foundation", "Structural Work"],
        "Start": ["2024-03-01", "2024-04-16", "2024-07-01"],
        "End": ["2024-04-15", "2024-06-30", "2024-09-30"]
    })
    fig = px.timeline(timeline, x_start="Start", x_end="End", y="Phase", color="Phase")
    fig.update_layout(template="plotly_dark", height=300)
    st.plotly_chart(fig, use_container_width=True)

    # Risk Analysis (Placeholder)
    st.subheader("⚠️ Risk Assessment")
    risk_data = pd.DataFrame({
        "labels": ["PROJECT", "Financial", "Regulatory", "Weather", "Supplies"],
        "parents": ["", "PROJECT", "PROJECT", "PROJECT", "PROJECT"],
        "values": [0, 10, 20, 30, 40]
    })
    fig2 = px.sunburst(risk_data, names='labels', parents='parents', values='values')
    fig2.update_layout(template="plotly_dark", height=400)
    st.plotly_chart(fig2, use_container_width=True)

# ---------- Prediction from Dataset ----------
if menu == "AI Recommendations":
    st.title("🔮 AI-Based Resource Efficiency Forecasting")
    if model:
        row_index = st.number_input("Select a row index for prediction:", min_value=0, max_value=len(df)-1, step=1)
        features = df.drop(columns=['Resource Allocation Efficiency']).iloc[row_index]

        st.write("### Selected Features:")
        st.dataframe(features.to_frame().T)

        prediction = model.predict([features])[0]
        st.success(f"✅ Predicted Resource Allocation Efficiency: **{prediction:.2f}%**")
    else:
        st.error("Model not available for prediction.")
