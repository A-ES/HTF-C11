from flask import Flask, request, render_template
import pandas as pd
import pickle
import os

app = Flask(__name__)

# Load all models dynamically
models = {
    "efficiency": pickle.load(open("artifacts/efficiency_model.pkl", "rb")),
    "risk": pickle.load(open("artifacts/risk_model.pkl", "rb")),
    "duration": pickle.load(open("artifacts/duration_model.pkl", "rb"))
}

# Load preprocessor (assumed shared across models)
preprocessor = pickle.load(open("artifacts/preprocessor.pkl", "rb"))

class CustomData:
    def __init__(self, labor, equipment, material, duration,
                 schedule_opt, comp_time, cost, metric,
                 mean_demand, sd_demand, risk_level):
        self.data = {
            "Labor Requirements": [float(labor)],
            "Equipment Usage": [float(equipment)],
            "Material Quantities": [float(material)],
            "Project Duration (days)": [float(duration)],
            "Schedule Optimization": [float(schedule_opt)],
            "Computation Time (CT)": [float(comp_time)],
            "Best Cost (BC)": [float(cost)],
            "Evaluation Metric (Nfe)": [float(metric)],
            "Mean Resource Demand": [float(mean_demand)],
            "SD of Resource Demand": [float(sd_demand)],
            "Risk Level": [float(risk_level)]
        }

    def to_dataframe(self):
        return pd.DataFrame(self.data)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        try:
            form_data = request.form
            target = form_data["target"]  # "efficiency", "risk", or "duration"

            data = CustomData(
                labor=form_data["labor"],
                equipment=form_data["equipment"],
                material=form_data["material"],
                duration=form_data["duration"],
                schedule_opt=form_data["schedule_opt"],
                comp_time=form_data["comp_time"],
                cost=form_data["cost"],
                metric=form_data["metric"],
                mean_demand=form_data["mean_demand"],
                sd_demand=form_data["sd_demand"],
                risk_level=form_data["risk_level"]
            )
            df = data.to_dataframe()
            scaled = preprocessor.transform(df)

            # Pick appropriate model
            model = models[target]
            prediction = model.predict(scaled)[0]

            return render_template("dashboard.html", prediction=prediction, target=target, input_data=df.iloc[0].to_dict())

        except Exception as e:
            print(f"Error: {e}")
            return render_template("dashboard.html", error="Something went wrong.")

    return render_template("dashboard.html", prediction=None)
