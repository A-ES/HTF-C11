import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Number of data points
num_samples = 2000

# Define possible project types
project_types = ['Residential Building', 'Commercial Building', 'Road Construction', 'Bridge Construction', 'Infrastructure Project']

# Define possible weather conditions
weather_conditions = ['Clear', 'Rainy', 'Cloudy', 'Snowy', 'Windy']

# Define possible material types
material_types = ['Concrete', 'Steel', 'Wood', 'Asphalt', 'Bricks']

# Define equipment types
equipment_types = ['Excavator', 'Crane', 'Bulldozer', 'Truck', 'Loader']

# --- Feature Generation ---
planned_start_dates = [datetime(2023, 1, 1) + timedelta(days=random.randint(0, 730)) for _ in range(num_samples)]
seasonal_factors = [1.0 if 3 <= dt.month <= 10 else 0.8 + random.uniform(0, 0.2) for dt in planned_start_dates]

data = {
    'ProjectID': [f'PID{i+1:04d}' for i in range(num_samples)],
    'ProjectType': np.random.choice(project_types, num_samples),
    'ProjectSize(sqm)': np.random.randint(500, 10000, num_samples),
    'Duration(days)': np.random.randint(30, 365, num_samples),
    'PlannedStartDate': planned_start_dates,
    'WeatherCondition': np.random.choice(weather_conditions, num_samples),
    'Temperature(C)': np.random.uniform(-5, 35, num_samples),
    'Rainfall(mm)': np.random.uniform(0, 50, num_samples),
    'WindSpeed(km/h)': np.random.uniform(0, 60, num_samples),
    'MaterialType': np.random.choice(material_types, num_samples),
    'MaterialQuantity(tons)': np.random.uniform(10, 500, num_samples),
    'EquipmentType': np.random.choice(equipment_types, num_samples),
    'EquipmentHours': np.random.randint(50, 1000, num_samples),
    'LaborHoursPlanned': np.random.randint(500, 10000, num_samples),
    'SupplyLeadTime(days)': np.random.randint(1, 30, num_samples),
    'SeasonalFactor': seasonal_factors,
}

# Create DataFrame first for easier calculations using pandas methods
df = pd.DataFrame(data)

# --- Target Variable Generation ---
# Resource Needs: LaborHoursActual
weather_impact = df['WeatherCondition'].isin(['Rainy', 'Snowy']).astype(float) * 0.1
seasonal_noise = np.random.normal(0, 0.05, num_samples) * df['SeasonalFactor']
df['LaborHoursActual'] = df['LaborHoursPlanned'] * (
    1 + 0.0001 * df['ProjectSize(sqm)'] + weather_impact + seasonal_noise
)
df['LaborHoursActual'] = np.maximum(df['LaborHoursActual'], 100)

# Delays: Binary classification
delay_prob = (
    0.05
    + df['WeatherCondition'].isin(['Rainy', 'Snowy', 'Windy']).astype(float) * 0.1
    + 0.005 * df['SupplyLeadTime(days)']
    - 0.001 * df['Duration(days)']
    + np.random.normal(0, 0.02, num_samples)
)
df['Delayed'] = (delay_prob > 0.2).astype(int)

# Carbon Emissions
carbon_factors_material = {'Concrete': 0.15, 'Steel': 2.0, 'Wood': -0.4, 'Asphalt': 0.8, 'Bricks': 0.5}
carbon_factors_equipment = {'Excavator': 50, 'Crane': 75, 'Bulldozer': 60, 'Truck': 30, 'Loader': 40}

df['MaterialCarbonEmission'] = [
    carbon_factors_material[mat] * (qty * 1000)
    for mat, qty in zip(df['MaterialType'], df['MaterialQuantity(tons)'])
]
df['EquipmentCarbonEmission'] = [
    carbon_factors_equipment[eq] * hrs
    for eq, hrs in zip(df['EquipmentType'], df['EquipmentHours'])
]
df['TotalCarbonEmission'] = (
    df['MaterialCarbonEmission'] + df['EquipmentCarbonEmission'] + np.random.normal(0, 50, num_samples)
)
df['TotalCarbonEmission'] = np.maximum(df['TotalCarbonEmission'], 0)

# --- Save to CSV ---
os.makedirs('data', exist_ok=True)
csv_file_path = 'data/construction_data.csv'
df.to_csv(csv_file_path, index=False)

# --- Console Output ---
print(f"Synthetic construction dataset saved to: {csv_file_path}")
print(df.head())
print(f"Number of data points: {len(df)}")
