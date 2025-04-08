import os
import sys
import pandas as pd
from src.mlproject.exception import CustomException
from src.mlproject.utils import load_object  # Ensure this function exists in your utils

class PredictPipeline:
    def __init__(self):
        pass

    def predict(self, features):
        try:
            model_path = os.path.join("artifacts", "model.pkl")
            preprocessor_path = os.path.join("artifacts", "preprocessor.pkl")
            print("Before Loading")
            model = load_object(file_path=model_path)
            preprocessor = load_object(file_path=preprocessor_path)
            print("After Loading")
            data_scaled = preprocessor.transform(features)
            preds = model.predict(data_scaled)
            return preds

        except Exception as e:
            raise CustomException(e, sys)

class CustomData:
    def __init__(
        self,
        labor_requirements,
        equipment_usage,
        material_quantities,
        project_duration,
        schedule_optimization,
        computation_time,
        best_cost,
        evaluation_metric,
        mean_resource_demand,
        sd_resource_demand,
        risk_level
    ):
        self.labor_requirements = labor_requirements
        self.equipment_usage = equipment_usage
        self.material_quantities = material_quantities
        self.project_duration = project_duration
        self.schedule_optimization = schedule_optimization
        self.computation_time = computation_time
        self.best_cost = best_cost
        self.evaluation_metric = evaluation_metric
        self.mean_resource_demand = mean_resource_demand
        self.sd_resource_demand = sd_resource_demand
        self.risk_level = risk_level

    def get_data_as_data_frame(self):
        try:
            data_dict = {
                "Labor Requirements": [self.labor_requirements],
                "Equipment Usage": [self.equipment_usage],
                "Material Quantities": [self.material_quantities],
                "Project Duration (days)": [self.project_duration],
                "Schedule Optimization": [self.schedule_optimization],
                "Computation Time (CT)": [self.computation_time],
                "Best Cost (BC)": [self.best_cost],
                "Evaluation Metric (Nfe)": [self.evaluation_metric],
                "Mean Resource Demand": [self.mean_resource_demand],
                "SD of Resource Demand": [self.sd_resource_demand],
                "Risk Level": [self.risk_level]
            }
            return pd.DataFrame(data_dict)
        except Exception as e:
            raise CustomException(e, sys)
